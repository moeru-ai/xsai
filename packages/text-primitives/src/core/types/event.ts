import type { Content, ContentType } from './content'
import type { FinishReason } from './finish-reason'
import type { AssistantMessage } from './message'
import type { Usage } from './usage'

export interface ContentEndEvent {
  content: Content
  index: number
  type: 'content.end'
}

export interface ContentStartEvent {
  contentType: ContentType
  index: number
  type: 'content.start'
}

export interface ErrorEvent {
  cause?: unknown
  message: string
  type: 'error'
}

export type Event = EventMap[EventType]

export interface EventMap {
  'content.end': ContentEndEvent
  'content.start': ContentStartEvent
  'error': ErrorEvent
  'finish': FinishEvent
  'reasoning.delta': ReasoningDeltaEvent
  'text.delta': TextDeltaEvent
  'tool-call.delta': ToolCallDeltaEvent
}

export type EventType = keyof EventMap

export interface FinishEvent {
  message: AssistantMessage
  reason: FinishReason
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
