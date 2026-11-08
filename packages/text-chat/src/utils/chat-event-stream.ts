import type { FinishReason, StepStatus, Usage } from '@xsai/text'
import type { EventBuilder } from '@xsai/text/internal'

import type { ChatChunk, ChatDelta, ChatReasoningDetail, ChatUsage } from '../types'

import { XSAIError } from '@xsai/shared'
import { WireEventStream } from '@xsai/text/internal'

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

/**
 * Streamed `reasoning_details` arrive in fragments. Consecutive text fragments merge until one is
 * signed and consecutive summaries merge; other entries stay separate.
 */
const appendReasoningDetail = (details: ChatReasoningDetail[], { signature, summary, text, ...detail }: ChatReasoningDetail): void => {
  const last = details.at(-1)
  if (last?.type === detail.type && (detail.type === 'reasoning.summary' || (detail.type === 'reasoning.text' && last.signature == null))) {
    last.summary = summary == null ? last.summary : (last.summary ?? '') + summary
    last.text = text == null ? last.text : (last.text ?? '') + text
    last.signature ??= signature
    return
  }
  details.push({ ...detail, signature, summary, text })
}

export class ChatEventStream extends WireEventStream<ChatChunk> {
  // Preserve the wire field for assistant-message replay.
  private hasRefusal = false
  private readonly reasoningDetails: ChatReasoningDetail[] = []
  private reasoningField?: 'reasoning' | 'reasoning_content'

  constructor(includeRawEvents = false) {
    super((chunk, builder) => {
      if (chunk.error != null) {
        builder.fail(new XSAIError('model-error', chunk.error.message, {
          cause: chunk.error,
        }))
        return
      }

      builder.meta({ model: chunk.model })
      if (chunk.usage != null)
        builder.meta({ usage: normalizeUsage(chunk.usage) })

      for (const choice of chunk.choices ?? []) {
        if (choice.index !== 0)
          continue

        if (choice.delta != null)
          this.onDelta(builder, choice.delta)

        if (choice.finish_reason != null) {
          this.endReasoning(builder)
          const finish = mapFinish(choice.finish_reason, this.hasRefusal)
          builder.done(finish.status, finish.reason)
        }
      }
    }, includeRawEvents)
  }

  private endReasoning(builder: EventBuilder): void {
    if (this.reasoningField == null && this.reasoningDetails.length === 0)
      return
    builder.end('reasoning', { providerMetadata: { chat: {
      reasoning_details: this.reasoningDetails.length === 0 ? undefined : this.reasoningDetails,
      reasoning_field: this.reasoningField,
    } } })
  }

  private onDelta(builder: EventBuilder, delta: ChatDelta): void {
    const reasoning = delta.reasoning_content ?? delta.reasoning
    if (reasoning != null && reasoning !== '') {
      this.reasoningField ??= delta.reasoning_content != null ? 'reasoning_content' : 'reasoning'
      builder.start('reasoning', 'reasoning')
      builder.delta('reasoning', reasoning)
    }

    // Visible text also arrives in `reasoning`; details are kept for replay only.
    for (const detail of delta.reasoning_details ?? []) {
      builder.start('reasoning', 'reasoning')
      appendReasoningDetail(this.reasoningDetails, detail)
    }

    const content = delta.content ?? ''
    if (content !== '') {
      builder.start('text', 'text')
      builder.delta('text', content)
    }

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
