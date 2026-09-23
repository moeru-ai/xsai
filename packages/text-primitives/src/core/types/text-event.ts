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

export interface RawEvent {
  detail: unknown
  type: 'raw'
}

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

/** @internal */
export interface StepEndDoneEvent {
  error?: never
  message: AssistantMessage
  reason?: FinishReason
  status: Exclude<StepStatus, 'failed'>
  type: 'step.end'
  usage?: Usage
}

export type StepEndEvent = StepEndDoneEvent | StepEndFailEvent

/** @internal */
export interface StepEndFailEvent {
  error: XSAIError
  message: AssistantMessage
  reason?: never
  status: 'failed'
  type: 'step.end'
  usage?: Usage
}

export interface StepStartEvent {
  type: 'step.start'
}

export type StepStatus = 'cancelled' | 'completed' | 'failed' | 'incomplete'

export interface TextDeltaEvent {
  delta: string
  index: number
  type: 'text.delta'
}

export type TextEvent = TextEventMap[TextEventType]

export interface TextEventMap {
  'content.end': ContentEndEvent
  'content.start': ContentStartEvent
  'raw': RawEvent
  'reasoning.delta': ReasoningDeltaEvent
  'refusal.delta': RefusalDeltaEvent
  'step.end': StepEndEvent
  'step.start': StepStartEvent
  'text.delta': TextDeltaEvent
  'tool-call.delta': ToolCallDeltaEvent
}

export type TextEventType = keyof TextEventMap

export interface ToolCallDeltaEvent {
  callId: string
  delta: string
  index: number
  name?: string
  type: 'tool-call.delta'
}
