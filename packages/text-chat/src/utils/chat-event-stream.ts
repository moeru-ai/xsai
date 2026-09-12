import type { AssistantMessageContent, Event, FinishReason, Usage } from '@xsai/text-primitives'

import type { ChatChunk, ChatDelta, ChatToolCallDelta, ChatUsage } from '../types'

import { reconcileFinishReason } from '@xsai/text-primitives'

interface ToolCallState {
  args: string
  id?: string
  name?: string
  partIndex: number
}

// Gateways repeat id/name as '' or null on continuation deltas; only a
// non-empty string counts as identity.
const acceptIdentity = (current: string | undefined, incoming: string | undefined): string | undefined =>
  incoming != null && incoming !== '' ? incoming : current

const mapFinishReason = (reason: null | string | undefined): FinishReason => {
  switch (reason) {
    case 'content_filter':
      return 'content-filter'
    case 'function_call':
    case 'tool_calls':
      return 'tool-calls'
    case 'length':
      return 'max-output-tokens'
    case null:
    case 'stop':
    case undefined:
      return 'stop'
    default:
      return reason
  }
}

const normalizeUsage = (usage: ChatUsage): Usage => {
  const input = usage.prompt_tokens ?? 0
  const output = usage.completion_tokens ?? 0
  return {
    cacheReadInputTokens: usage.prompt_tokens_details?.cached_tokens ?? usage.prompt_cache_hit_tokens,
    inputTokens: input,
    outputTokens: output,
    reasoningTokens: usage.completion_tokens_details?.reasoning_tokens,
    totalTokens: usage.total_tokens ?? input + output,
  }
}

/** Converts Chat Completions API SSE data to text primitive events. */
export class ChatEventStream extends TransformStream<string, Event> {
  constructor() {
    const toolCalls = new Map<number, ToolCallState>()
    const parts: (AssistantMessageContent | undefined)[] = []
    let nextIndex = 0
    let reasoningIndex: number | undefined
    let reasoningField: 'reasoning' | 'reasoning_content' | undefined
    let reasoningText = ''
    let textIndex: number | undefined
    let text = ''
    let messageId: string | undefined
    let finishReason: null | string | undefined
    let usage: ChatUsage | undefined
    let partsClosed = false
    let sawChunk = false
    let sawError = false

    const startPart = (events: Event[], contentType: 'reasoning' | 'text' | 'tool-call'): number => {
      const index = nextIndex++
      events.push({ contentType, index, type: 'content.start' })
      return index
    }

    const onToolCall = (events: Event[], call: ChatToolCallDelta): void => {
      let state = toolCalls.get(call.index)

      if (state === undefined) {
        state = { args: '', partIndex: startPart(events, 'tool-call') }
        toolCalls.set(call.index, state)
      }

      state.id = acceptIdentity(state.id, call.id)
      state.name = acceptIdentity(state.name, call.function?.name)

      const args = call.function?.arguments ?? ''
      if (args === '')
        return

      state.args += args
      events.push({
        delta: args,
        id: state.id ?? `call_${call.index}`,
        index: state.partIndex,
        name: state.name,
        type: 'tool-call.delta',
      })
    }

    const onDelta = (events: Event[], delta: ChatDelta): void => {
      const reasoning = delta.reasoning_content ?? delta.reasoning
      if (reasoning !== undefined && reasoning !== '') {
        // Ollama emits `reasoning`, DeepSeek `reasoning_content`; remember
        // which field this wire used so replays write the same one.
        reasoningField ??= delta.reasoning_content !== undefined ? 'reasoning_content' : 'reasoning'
        reasoningIndex ??= startPart(events, 'reasoning')
        reasoningText += reasoning
        events.push({ delta: reasoning, index: reasoningIndex, type: 'reasoning.delta' })
      }

      // Refusal is a sibling field of content on this wire; a refusal turn
      // streams content:null. Prefer non-empty content per delta so a
      // simultaneous refusal is dropped rather than merged into the text.
      const content = delta.content != null && delta.content !== ''
        ? delta.content
        : (delta.refusal ?? delta.content ?? '')
      if (content !== '') {
        textIndex ??= startPart(events, 'text')
        text += content
        events.push({ delta: content, index: textIndex, type: 'text.delta' })
      }

      for (const call of delta.tool_calls ?? [])
        onToolCall(events, call)
    }

    const closeParts = (): Event[] => {
      if (partsClosed)
        return []

      partsClosed = true

      if (reasoningIndex !== undefined) {
        parts[reasoningIndex] = {
          content: [{ text: reasoningText, type: 'text' }],
          ...(reasoningField === undefined ? {} : { metadata: { chat: { reasoning_field: reasoningField } } }),
          type: 'reasoning',
        }
      }

      if (textIndex !== undefined)
        parts[textIndex] = { text, type: 'text' }

      for (const [wireIndex, call] of toolCalls) {
        // Some wires never send a tool call id.
        const id = call.id ?? `call_${wireIndex}`
        parts[call.partIndex] = {
          arguments: call.args,
          callId: id,
          id,
          name: call.name ?? '',
          type: 'tool-call',
        }
      }

      const events: Event[] = []
      parts.forEach((content, index) => {
        if (content === undefined)
          return

        events.push({ content, index, type: 'content.end' })
      })
      return events
    }

    const mapChunk = (chunk: ChatChunk): Event[] => {
      const events: Event[] = []

      if (chunk.error !== undefined) {
        sawChunk = true
        sawError = true
        events.push({ cause: chunk.error, message: chunk.error.message, type: 'error' })
        return events
      }

      if (chunk.id !== undefined)
        messageId ??= chunk.id

      if (chunk.usage !== undefined) {
        usage = chunk.usage
        sawChunk = true
      }

      for (const choice of chunk.choices ?? []) {
        // Only the first choice is supported; `n > 1` is out of scope.
        if (choice.index !== 0)
          continue

        sawChunk = true
        onDelta(events, choice.delta)

        if (choice.finish_reason != null) {
          finishReason = choice.finish_reason
          events.push(...closeParts())
        }
      }

      return events
    }

    const finish = (): Event => {
      const content = parts.filter((part): part is AssistantMessageContent => part !== undefined)
      // An error chunk without a finish_reason still ends the turn.
      const reason = sawError && finishReason == null ? 'error' : mapFinishReason(finishReason)
      return {
        message: {
          content,
          ...(messageId === undefined ? {} : { id: messageId }),
          role: 'assistant',
        },
        reason: reconcileFinishReason(content, reason),
        type: 'finish',
        ...(usage === undefined ? {} : { usage: normalizeUsage(usage) }),
      }
    }

    super({
      flush: (controller) => {
        for (const event of closeParts())
          controller.enqueue(event)

        if (sawChunk)
          controller.enqueue(finish())
      },
      transform: (data, controller) => {
        for (const event of mapChunk(JSON.parse(data) as ChatChunk))
          controller.enqueue(event)
      },
    })
  }
}
