import type { AnthropicContentBlock, AnthropicMessage } from './anthropic-message'
import type { AnthropicStopReason } from './finish-reason'
import type { DeltaUsage } from './usage'

export interface CitationsDelta {
  citation: unknown
  type: 'citations_delta'
}

export type ContentBlockDelta = CitationsDelta | InputJsonDelta | SignatureDelta | TextDelta | ThinkingDelta

export interface ContentBlockDeltaEvent {
  delta: ContentBlockDelta
  index: number
  type: 'content_block_delta'
}

export interface ContentBlockStartEvent {
  content_block: AnthropicContentBlock
  index: number
  type: 'content_block_start'
}

export interface ContentBlockStopEvent {
  index: number
  type: 'content_block_stop'
}

export interface ErrorEvent {
  error: {
    message: string
    type: string
  }
  type: 'error'
}

export interface InputJsonDelta {
  partial_json: string
  type: 'input_json_delta'
}

export interface MessageDeltaEvent {
  delta: {
    stop_reason: AnthropicStopReason | null
    stop_sequence: null | string
  }
  type: 'message_delta'
  usage: DeltaUsage
}

export interface MessageStartEvent {
  message: AnthropicMessage
  type: 'message_start'
}

export interface MessageStopEvent {
  type: 'message_stop'
}

export interface PingEvent {
  type: 'ping'
}

export interface SignatureDelta {
  signature: string
  type: 'signature_delta'
}

export type StreamingEvent = ContentBlockDeltaEvent | ContentBlockStartEvent | ContentBlockStopEvent | ErrorEvent | MessageDeltaEvent | MessageStartEvent | MessageStopEvent | PingEvent

export interface TextDelta {
  text: string
  type: 'text_delta'
}

export interface ThinkingDelta {
  thinking: string
  type: 'thinking_delta'
}
