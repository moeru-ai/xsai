import type { XSAIError } from '@xsai/shared'

import type { FinishReason } from './finish-reason'
import type { AssistantMessage, AssistantMessageContent } from './message'
import type { Usage } from './usage'

export interface ContentEndEvent {
  content: AssistantMessageContent
  index: number
  type: 'content.end'
}

export interface ContentStartEvent {
  contentType: AssistantMessageContent['type']
  index: number
  type: 'content.start'
}

export type Event = EventMap[EventType]

export interface EventMap {
  'content.end': ContentEndEvent
  'content.start': ContentStartEvent
  'reasoning.delta': ReasoningDeltaEvent
  'refusal.delta': RefusalDeltaEvent
  'stream.end': StreamEndEvent
  'stream.start': StreamStartEvent
  'text.delta': TextDeltaEvent
  'tool-call.delta': ToolCallDeltaEvent
}

export type EventType = keyof EventMap

export interface ReasoningDeltaEvent {
  delta: string
  index: number
  type: 'reasoning.delta'
}

export interface RefusalDeltaEvent {
  delta: string
  index: number
  type: 'refusal.delta'
}

export interface StreamEndEvent {
  /** The terminating error. Present when `reason` is `'error'`. */
  error?: XSAIError
  message: AssistantMessage
  reason: FinishReason
  /** Wire response id, distinct from the replayable assistant message id. */
  responseId?: string
  /** Last response status reported by the wire. */
  responseStatus?: string
  type: 'stream.end'
  usage?: Usage
}

export interface StreamStartEvent {
  type: 'stream.start'
}

export interface TextDeltaEvent {
  delta: string
  index: number
  type: 'text.delta'
}

export interface ToolCallDeltaEvent {
  delta: string
  id: string
  index: number
  name?: string
  type: 'tool-call.delta'
}
