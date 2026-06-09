import type { CompletionToolCall, CompletionToolResult } from './tool'
import type { Usage } from './usage'

export interface ErrorEvent {
  cause?: unknown
  message: string
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

export type EventType = Event['type']

export interface ReasoningDeltaEvent {
  delta: string
  type: 'reasoning.delta'
}

export interface ReasoningDoneEvent {
  content: string
  type: 'reasoning.done'
}

export interface ReasoningStartEvent {
  type: 'reasoning.start'
}

export interface StepDoneEvent {
  // TODO: reason
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
  content: string
  type: 'text.done'
}

export interface TextStartEvent {
  type: 'text.start'
}

export interface ToolCallDeltaEvent {
  delta: string
  type: 'tool-call.delta'
}

export interface ToolCallDoneEvent extends CompletionToolCall {
  type: 'tool-call.done'
}

export interface ToolCallStartEvent extends Omit<CompletionToolCall, 'args' | 'toolCallType'> {
  type: 'tool-call.start'
}

export interface ToolResultDoneEvent extends CompletionToolResult {
  type: 'tool-result.done'
}
