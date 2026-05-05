// import type { CompletionToolCall, CompletionToolResult, FinishReason, Usage } from '@xsai/shared-chat'

import type { ErrorPayload, ItemField } from '../generated'
import type { Usage } from './usage'

export interface ErrorEvent {
  error: ErrorPayload
  type: 'error'
}

export type Event = ErrorEvent
  | ReasoningDeltaEvent
  | ReasoningDoneEvent
  | ReasoningStartEvent
  | StepDoneEvent
  | StepStartEvent
  | TextDeltaEvent
  | TextDoneEvent
  | TextStartEvent
  | ToolCallDeltaEvent
  | ToolCallDoneEvent
  | ToolCallStartEvent
  | ToolResultDoneEvent

export interface ReasoningDeltaEvent {
  delta: string
  type: 'reasoning.delta'
}

export interface ReasoningDoneEvent {
  text: string
  type: 'reasoning.done'
}

export interface ReasoningStartEvent {
  outputIndex: number
  type: 'reasoning.start'
}

export interface StepDoneEvent {
  // TODO: reason
  output: ItemField[]
  type: 'step.done'
  usage?: Usage
}

export interface StepStartEvent {
  type: 'step.start'
}

export interface TextDeltaEvent {
  delta: string
  type: 'text.delta'
}

export interface TextDoneEvent {
  text: string
  type: 'text.done'
}

export interface TextStartEvent {
  outputIndex: number
  type: 'text.start'
}

export interface ToolCallDeltaEvent {
  delta: string
  type: 'tool-call.delta'
}

export interface ToolCallDoneEvent {
  toolCall: {
    arguments: string
    id: string
    name: string
  }
  type: 'tool-call.done'
}

export interface ToolCallStartEvent {
  outputIndex: number
  toolCall: {
    id: string
    name: string
  }
  type: 'tool-call.start'
}

export interface ToolResultDoneEvent {
  toolResult: {
    id: string
    name: string
    output: unknown
  }
  type: 'tool-result.done'
}
