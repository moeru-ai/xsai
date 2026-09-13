import type { FinishReason, PartAssembler, Usage } from '@xsai/text-primitives'

import type { ChatChunk, ChatDelta, ChatUsage } from '../types'

import { XSAIError } from '@xsai/shared'
import { wireEventStream } from '@xsai/text-primitives'

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
export const chatEventStream = () => {
  // OpenAI emits `reasoning`, DeepSeek `reasoning_content`; remember which
  // field this wire used so replays write the same one.
  let reasoningField: 'reasoning' | 'reasoning_content' | undefined

  const onDelta = (asm: PartAssembler, delta: ChatDelta): void => {
    const reasoning = delta.reasoning_content ?? delta.reasoning
    if (reasoning !== undefined && reasoning !== '') {
      reasoningField ??= delta.reasoning_content !== undefined ? 'reasoning_content' : 'reasoning'
      asm.start('reasoning', 'reasoning')
      asm.delta('reasoning', reasoning)
    }

    // Refusal is a sibling field of content on this wire; a refusal turn
    // streams content:null. Prefer non-empty content per delta so a
    // simultaneous refusal is dropped rather than merged into the text.
    const content = delta.content != null && delta.content !== ''
      ? delta.content
      : (delta.refusal ?? delta.content ?? '')
    if (content !== '') {
      asm.start('text', 'text')
      asm.delta('text', content)
    }

    for (const call of delta.tool_calls ?? []) {
      const key: `tool:${number}` = `tool:${call.index}`
      asm.start(key, 'tool-call', { fallbackId: `call_${call.index}` })
      asm.delta(key, call.function?.arguments ?? '', { callId: call.id, name: call.function?.name })
    }
  }

  return wireEventStream<ChatChunk>((chunk, asm) => {
    if (chunk.error !== undefined) {
      asm.finish('error', {
        error: new XSAIError('model-error', chunk.error.message, { cause: chunk.error }),
      })
      return
    }

    if (chunk.id !== undefined)
      asm.meta({ messageId: chunk.id })
    if (chunk.usage != null)
      asm.meta({ usage: normalizeUsage(chunk.usage) })

    for (const choice of chunk.choices ?? []) {
      // Only the first choice is supported; `n > 1` is out of scope.
      if (choice.index !== 0)
        continue

      if (choice.delta !== undefined)
        onDelta(asm, choice.delta)

      if (choice.finish_reason != null) {
        if (reasoningField !== undefined)
          asm.end('reasoning', { metadata: { chat: { reasoning_field: reasoningField } } })
        asm.finish(mapFinishReason(choice.finish_reason))
      }
    }
  })
}
