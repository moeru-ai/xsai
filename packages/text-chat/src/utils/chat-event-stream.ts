import type { FinishReason, StepStatus, Usage } from '@xsai/text-primitives'
import type { EventBuilder } from '@xsai/text-primitives/internal'

import type { ChatChunk, ChatDelta, ChatUsage } from '../types'

import { XSAIError } from '@xsai/shared'
import { WireEventStream } from '@xsai/text-primitives/internal'

const mapFinish = (reason: null | string | undefined, refusal: boolean): { reason?: FinishReason, status: Exclude<StepStatus, 'failed'> } => {
  switch (reason) {
    case 'content_filter':
      return { reason: 'content-filter', status: 'incomplete' }
    case 'length':
    case 'max_output_tokens':
    case 'max_tokens':
      return { reason: 'length', status: 'incomplete' }
    case null:
    case undefined:
      return { status: 'completed' }
    case 'stop':
      return { reason: refusal ? 'refusal' : 'stop', status: 'completed' }
    case 'tool_calls':
      return { reason: 'tool-calls', status: 'completed' }
    default:
      return { reason, status: 'completed' }
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
  // Preserve the wire field for assistant-message replay.
  private hasRefusal = false
  private reasoningField?: 'reasoning' | 'reasoning_content'

  constructor() {
    super((chunk, builder) => {
      if (chunk.error != null) {
        builder.fail(new XSAIError('model-error', chunk.error.message, {
          cause: chunk.error,
        }))
        return
      }

      if (chunk.usage != null)
        builder.meta({ usage: normalizeUsage(chunk.usage) })

      for (const choice of chunk.choices ?? []) {
        // Only the first choice is supported.
        if (choice.index !== 0)
          continue

        if (choice.delta != null)
          this.onDelta(builder, choice.delta)

        if (choice.finish_reason != null) {
          if (this.reasoningField != null)
            builder.end('reasoning', { providerMetadata: { chat: { reasoning_field: this.reasoningField } } })
          const finish = mapFinish(choice.finish_reason, this.hasRefusal)
          builder.done(finish.status, finish.reason)
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

    // Refusal is a separate part from content.
    const refusal = delta.refusal ?? ''
    if (refusal !== '') {
      this.hasRefusal = true
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
