import type { Usage } from '@xsai/shared-chat'

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

// TODO: extends CompletionToolCall
export interface ToolCallDoneEvent {
  args: string
  toolCallId: string
  toolName: string
  type: 'tool-call.done'
}

// TODO: extends Omit<CompletionToolCall, 'args'>
export interface ToolCallStartEvent {
  toolCallId: string
  toolName: string
  type: 'tool-call.start'
}

// TODO: extends CompletionToolResult
export interface ToolResultDoneEvent {
  args: unknown
  result: unknown
  toolCallId: string
  toolName: string
  type: 'tool-result.done'
}
