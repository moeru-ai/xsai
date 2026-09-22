import type { EventBuilder, FinishReason, StepStatus, Usage } from '@xsai/text-primitives'

import type {
  ContentBlockStartEvent,
  MessagesEvent,
  MessagesUsage,
} from '../types'

import { XSAIError } from '@xsai/shared'
import { WireEventStream } from '@xsai/text-primitives'

const mapStop = (FinishReason: null | string | undefined): { reason?: FinishReason, status: Exclude<StepStatus, 'failed'> } => {
  switch (FinishReason) {
    case 'content_filter':
      return { reason: 'content-filter', status: 'incomplete' }
    case 'end_turn':
    case 'stop_sequence':
      return { reason: 'stop', status: 'completed' }
    case 'max_output_tokens':
    case 'max_tokens':
      return { reason: 'length', status: 'incomplete' }
    case null:
    case undefined:
      return { status: 'completed' }
    case 'refusal':
      return { reason: 'refusal', status: 'completed' }
    case 'tool_use':
      return { reason: 'tool-calls', status: 'completed' }
    default:
      return { reason: FinishReason, status: 'completed' }
  }
}

const mergeUsage = (start: MessagesUsage | undefined, delta: MessagesUsage | undefined): undefined | Usage => {
  const inputTokens = delta?.input_tokens ?? start?.input_tokens
  const outputTokens = delta?.output_tokens ?? start?.output_tokens

  if (inputTokens == null && outputTokens == null)
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

export class MessagesEventStream extends WireEventStream<MessagesEvent> {
  private deltaUsage?: MessagesUsage
  private FinishReason?: null | string
  private readonly signatures = new Map<number, string>()
  private startUsage?: MessagesUsage

  constructor() {
    super((event, builder) => {
      switch (event.type) {
        case 'content_block_delta':
          switch (event.delta.type) {
            case 'input_json_delta':
              builder.delta(event.index, event.delta.partial_json)
              break
            case 'signature_delta':
              this.signatures.set(event.index, (this.signatures.get(event.index) ?? '') + event.delta.signature)
              break
            case 'text_delta':
              builder.delta(event.index, event.delta.text)
              break
            case 'thinking_delta':
              builder.delta(event.index, event.delta.thinking)
              break
          }
          break
        case 'content_block_start':
          this.onStart(builder, event)
          break
        case 'content_block_stop': {
          const signature = this.signatures.get(event.index)
          this.signatures.delete(event.index)
          builder.end(event.index, signature == null ? {} : { providerMetadata: { messages: { signature } } })
          break
        }
        case 'error':
          builder.fail(new XSAIError('model-error', event.error.message, {
            cause: event.error,
          }))
          break
        case 'message_delta':
          this.FinishReason = event.delta.stop_reason
          this.deltaUsage = event.usage
          break
        case 'message_start':
          builder.meta({ messageId: event.message.id })
          this.startUsage = event.message.usage
          break
        case 'message_stop': {
          const usage = mergeUsage(this.startUsage, this.deltaUsage)
          if (usage != null)
            builder.meta({ usage })
          const finish = mapStop(this.FinishReason)
          builder.done(finish.status, finish.reason)
          break
        }
        case 'ping':
          break
      }
    })
  }

  private onStart(builder: EventBuilder, event: ContentBlockStartEvent): void {
    const block = event.content_block

    switch (block.type) {
      case 'document':
      case 'image':
      case 'tool_result':
        break
      case 'redacted_thinking':
        builder.start(event.index, 'reasoning')
        builder.end(event.index, {
          content: { content: [{ text: block.data, type: 'redacted' }], type: 'reasoning' },
        })
        break
      case 'text':
        builder.start(event.index, 'text')
        if (block.text !== '')
          builder.delta(event.index, block.text)
        break
      case 'thinking':
        builder.start(event.index, 'reasoning')
        if (block.thinking !== '')
          builder.delta(event.index, block.thinking)
        if (block.signature != null)
          this.signatures.set(event.index, block.signature)
        break
      case 'tool_use':
        builder.start(event.index, 'tool-call', { callId: block.id, id: block.id, name: block.name })
        break
    }
  }
}
