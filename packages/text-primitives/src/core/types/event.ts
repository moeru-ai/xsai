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
  'finish': FinishEvent
  'reasoning.delta': ReasoningDeltaEvent
  'text.delta': TextDeltaEvent
  'tool-call.delta': ToolCallDeltaEvent
}

export type EventType = keyof EventMap

export interface FinishEvent {
  /** The terminating error. Present when `reason` is `'error'`. */
  error?: XSAIError
  message: AssistantMessage
  reason: FinishReason
  /**
   * Response-scoped generation id (e.g. Chat `chatcmpl-*`, Responses
   * `resp_*`), when the wire has one. Distinct from `message.id`, the
   * replayable assistant message id — a wire may carry both, either, or
   * neither.
   */
  responseId?: string
  type: 'finish'
  usage?: Usage
}

export interface ReasoningDeltaEvent {
  delta: string
  index: number
  type: 'reasoning.delta'
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
