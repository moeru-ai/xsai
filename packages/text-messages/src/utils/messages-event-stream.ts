import type { FinishReason, PartAssembler, Usage } from '@xsai/text-primitives'

import type {
  ContentBlockStartEvent,
  MessagesEvent,
  MessagesUsage,
} from '../types'

import { XSAIError } from '@xsai/shared'
import { WireEventStream } from '@xsai/text-primitives'

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
      return 'refusal'
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

/** Converts Messages API SSE data to text primitive events. */
export class MessagesEventStream extends WireEventStream<MessagesEvent> {
  private deltaUsage?: MessagesUsage
  private readonly signatures = new Map<number, string>()
  private startUsage?: MessagesUsage
  private stopReason?: null | string

  constructor() {
    super((event, asm) => {
      switch (event.type) {
        case 'content_block_delta':
          switch (event.delta.type) {
            case 'input_json_delta':
              asm.delta(event.index, event.delta.partial_json)
              break
            case 'signature_delta':
              this.signatures.set(event.index, (this.signatures.get(event.index) ?? '') + event.delta.signature)
              break
            case 'text_delta':
              asm.delta(event.index, event.delta.text)
              break
            case 'thinking_delta':
              asm.delta(event.index, event.delta.thinking)
              break
          }
          break
        case 'content_block_start':
          this.onStart(asm, event)
          break
        case 'content_block_stop': {
          const signature = this.signatures.get(event.index)
          this.signatures.delete(event.index)
          asm.end(event.index, signature === undefined ? {} : { metadata: { messages: { signature } } })
          break
        }
        case 'error':
          asm.finish('error', {
            error: new XSAIError('model-error', event.error.message, { cause: event.error }),
          })
          break
        case 'message_delta':
          this.stopReason = event.delta.stop_reason
          this.deltaUsage = event.usage
          break
        case 'message_start':
          asm.meta({ messageId: event.message.id })
          this.startUsage = event.message.usage
          break
        case 'message_stop': {
          const usage = mergeUsage(this.startUsage, this.deltaUsage)
          if (usage !== undefined)
            asm.meta({ usage })
          asm.finish(mapStopReason(this.stopReason))
          break
        }
        case 'ping':
          break
      }
    })
  }

  private onStart(asm: PartAssembler, event: ContentBlockStartEvent): void {
    const block = event.content_block

    switch (block.type) {
      case 'document':
      case 'image':
      case 'tool_result':
        break
      case 'redacted_thinking':
        asm.start(event.index, 'reasoning')
        asm.end(event.index, {
          content: { content: [{ data: block.data, type: 'redacted' }], type: 'reasoning' },
        })
        break
      case 'text':
        asm.start(event.index, 'text')
        if (block.text !== '')
          asm.delta(event.index, block.text)
        break
      case 'thinking':
        asm.start(event.index, 'reasoning')
        if (block.thinking !== '')
          asm.delta(event.index, block.thinking)
        if (block.signature !== undefined)
          this.signatures.set(event.index, block.signature)
        break
      case 'tool_use':
        asm.start(event.index, 'tool-call', { callId: block.id, id: block.id, name: block.name })
        break
    }
  }
}
