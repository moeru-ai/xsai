import type { EventBuilder, FinishReason, Usage } from '@xsai/text-primitives'

import type { ChatChunk, ChatDelta, ChatUsage } from '../types'

import { XSAIError } from '@xsai/shared'
import { WireEventStream } from '@xsai/text-primitives'

const mapFinishReason = (reason: null | string | undefined): FinishReason => {
  switch (reason) {
    case 'content_filter':
      return 'content-filter'
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

export class ChatEventStream extends WireEventStream<ChatChunk> {
  // OpenAI emits `reasoning`, DeepSeek `reasoning_content`; remember which
  // field this wire used so replays write the same one.
  private reasoningField?: 'reasoning' | 'reasoning_content'

  constructor() {
    super((chunk, builder) => {
      if (chunk.error != null) {
        builder.finish('error', {
          error: new XSAIError('model-error', chunk.error.message, { cause: chunk.error }),
        })
        return
      }

      // A chunk's id is the response-scoped completion id (`chatcmpl-*`),
      // not a replayable assistant message id — Chat has no equivalent.
      if (chunk.id != null)
        builder.meta({ responseId: chunk.id })
      if (chunk.usage != null)
        builder.meta({ usage: normalizeUsage(chunk.usage) })

      for (const choice of chunk.choices ?? []) {
        // Only the first choice is supported; `n > 1` is out of scope.
        if (choice.index !== 0)
          continue

        if (choice.delta != null)
          this.onDelta(builder, choice.delta)

        if (choice.finish_reason != null) {
          if (this.reasoningField != null)
            builder.end('reasoning', { metadata: { chat: { reasoning_field: this.reasoningField } } })
          builder.finish(mapFinishReason(choice.finish_reason))
        }
      }
    })
  }

  private onDelta(builder: EventBuilder, delta: ChatDelta): void {
    const reasoning = delta.reasoning_content ?? delta.reasoning
    if (reasoning != null && reasoning !== '') {
      this.reasoningField ??= delta.reasoning_content != null ? 'reasoning_content' : 'reasoning'
      builder.start('reasoning', 'reasoning')
      builder.delta('reasoning', reasoning)
    }

    const content = delta.content ?? ''
    if (content !== '') {
      builder.start('text', 'text')
      builder.delta('text', content)
    }

    // Refusal is a sibling field of content on this wire; a refusal turn
    // streams content:null. It is its own part, never merged into text.
    const refusal = delta.refusal ?? ''
    if (refusal !== '') {
      builder.start('refusal', 'refusal')
      builder.delta('refusal', refusal)
    }

    for (const call of delta.tool_calls ?? []) {
      const key: `tool:${number}` = `tool:${call.index}`
      builder.start(key, 'tool-call', { fallbackId: `call_${call.index}` })
      builder.delta(key, call.function?.arguments ?? '', { callId: call.id, name: call.function?.name })
    }
  }
}
