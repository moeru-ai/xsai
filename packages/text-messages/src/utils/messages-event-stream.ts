import type { AssistantMessageContent, Event, FinishReason, Usage } from '@xsai/text-primitives'

import type {
  ContentBlockDeltaEvent,
  ContentBlockStartEvent,
  ContentBlockStopEvent,
  MessagesEvent,
  MessagesUsage,
} from '../types'

type BlockState
  = | { data: string, type: 'redacted_thinking' }
    | { inputJson: string, toolCallId: string, toolName: string, type: 'tool_use' }
    | { signature?: string, thinking: string, type: 'thinking' }
    | { text: string, type: 'text' }

const mapStopReason = (stopReason: null | string | undefined): FinishReason => {
  switch (stopReason) {
    case 'end_turn':
    case 'stop_sequence':
      return 'stop'
    case 'max_tokens':
      return 'max-output-tokens'
    case null:
    case undefined:
      return 'stop'
    case 'refusal':
      return 'content-filter'
    case 'tool_use':
      return 'tool-calls'
    default:
      return stopReason
  }
}

const mergeUsage = (start: MessagesUsage | undefined, delta: MessagesUsage | undefined): undefined | Usage => {
  const inputTokens = delta?.input_tokens ?? start?.input_tokens
  const outputTokens = delta?.output_tokens ?? start?.output_tokens

  if (inputTokens === undefined && outputTokens === undefined)
    return undefined

  const input = inputTokens ?? 0
  const output = outputTokens ?? 0
  const cacheRead = start?.cache_read_input_tokens ?? delta?.cache_read_input_tokens
  const cacheCreation = start?.cache_creation_input_tokens ?? delta?.cache_creation_input_tokens

  return {
    cacheCreationInputTokens: cacheCreation,
    cacheReadInputTokens: cacheRead,
    inputTokens: input,
    outputTokens: output,
    reasoningTokens: delta?.output_tokens_details?.thinking_tokens,
    // Anthropic reports no total and counts cache buckets separately from input_tokens.
    totalTokens: input + output + (cacheRead ?? 0) + (cacheCreation ?? 0),
  }
}

const openBlock = (event: ContentBlockStartEvent): undefined | { block?: BlockState, event: Event } => {
  const block = event.content_block

  switch (block.type) {
    case 'document':
    case 'image':
    case 'tool_result':
      return undefined
    case 'redacted_thinking':
      return {
        block: { data: block.data, type: 'redacted_thinking' },
        event: { contentType: 'reasoning', index: event.index, type: 'content.start' },
      }
    case 'text':
      return {
        block: { text: block.text, type: 'text' },
        event: { contentType: 'text', index: event.index, type: 'content.start' },
      }
    case 'thinking':
      return {
        block: { signature: block.signature, thinking: block.thinking, type: 'thinking' },
        event: { contentType: 'reasoning', index: event.index, type: 'content.start' },
      }
    case 'tool_use':
      return {
        block: { inputJson: '', toolCallId: block.id, toolName: block.name, type: 'tool_use' },
        event: { contentType: 'tool-call', index: event.index, type: 'content.start' },
      }
    default:
      return undefined
  }
}

const closeBlock = (block: BlockState): AssistantMessageContent => {
  switch (block.type) {
    case 'redacted_thinking':
      return { content: [{ data: block.data, type: 'redacted' }], type: 'reasoning' }
    case 'text':
      return { text: block.text, type: 'text' }
    case 'thinking':
      return {
        content: [{
          ...(block.signature === undefined ? {} : { signature: block.signature }),
          text: block.thinking,
          type: 'text',
        }],
        type: 'reasoning',
      }
    case 'tool_use':
      return {
        arguments: block.inputJson,
        callId: block.toolCallId,
        id: block.toolCallId,
        name: block.toolName,
        type: 'tool-call',
      }
  }
}

/** Converts Messages API SSE data to text primitive events. */
export class MessagesEventStream extends TransformStream<string, Event> {
  constructor() {
    const blocks = new Map<number, BlockState>()
    const parts: (AssistantMessageContent | undefined)[] = []
    let messageId: string | undefined
    let startUsage: MessagesUsage | undefined
    let stopReason: null | string | undefined
    let deltaUsage: MessagesUsage | undefined

    const onDelta = (event: ContentBlockDeltaEvent): Event | undefined => {
      const block = blocks.get(event.index)
      if (block === undefined)
        return undefined

      switch (event.delta.type) {
        case 'input_json_delta':
          if (block.type === 'tool_use') {
            block.inputJson += event.delta.partial_json
            return {
              delta: event.delta.partial_json,
              id: block.toolCallId,
              index: event.index,
              name: block.toolName,
              type: 'tool-call.delta',
            }
          }
          return undefined
        case 'signature_delta':
          if (block.type === 'thinking')
            block.signature = (block.signature ?? '') + event.delta.signature
          return undefined
        case 'text_delta':
          if (block.type === 'text') {
            block.text += event.delta.text
            return { delta: event.delta.text, index: event.index, type: 'text.delta' }
          }
          return undefined
        case 'thinking_delta':
          if (block.type === 'thinking') {
            block.thinking += event.delta.thinking
            return { delta: event.delta.thinking, index: event.index, type: 'reasoning.delta' }
          }
          return undefined
        default:
          return undefined
      }
    }

    const onStart = (event: ContentBlockStartEvent): Event | undefined => {
      const opened = openBlock(event)
      if (opened?.block !== undefined)
        blocks.set(event.index, opened.block)

      return opened?.event
    }

    const onStop = (event: ContentBlockStopEvent): Event | undefined => {
      const block = blocks.get(event.index)
      if (block === undefined)
        return undefined

      blocks.delete(event.index)
      const content = closeBlock(block)
      parts[event.index] = content
      return { content, index: event.index, type: 'content.end' }
    }

    const onFinish = (): Event => {
      const content = parts.filter((part): part is AssistantMessageContent => part !== undefined)
      const usage = mergeUsage(startUsage, deltaUsage)
      // Some wires report a plain stop on turns that emitted tool calls.
      const reason = mapStopReason(stopReason)
      return {
        message: {
          content,
          ...(messageId === undefined ? {} : { id: messageId }),
          role: 'assistant',
        },
        reason: reason === 'stop' && content.some(part => part.type === 'tool-call') ? 'tool-calls' : reason,
        type: 'finish',
        ...(usage === undefined ? {} : { usage }),
      }
    }

    const mapEvent = (event: MessagesEvent): Event | undefined => {
      switch (event.type) {
        case 'content_block_delta':
          return onDelta(event)
        case 'content_block_start':
          return onStart(event)
        case 'content_block_stop':
          return onStop(event)
        case 'error':
          return { cause: event.error, message: event.error.message, type: 'error' }
        case 'message_delta':
          stopReason = event.delta.stop_reason
          deltaUsage = event.usage
          return undefined
        case 'message_start':
          messageId = event.message.id
          startUsage = event.message.usage
          return undefined
        case 'message_stop':
          return onFinish()
        case 'ping':
          return undefined
        default:
          return undefined
      }
    }

    super({
      transform: (data, controller) => {
        const event = mapEvent(JSON.parse(data) as MessagesEvent)
        if (event !== undefined)
          controller.enqueue(event)
      },
    })
  }
}
