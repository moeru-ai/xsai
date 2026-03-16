import type { FinishReason } from './finish-reason'
import type { Message } from './message'
import type { CompletionToolCall, CompletionToolResult } from './tool'
import type { Usage } from './usage'

export type StopCondition = (context: StopContext) => boolean

export interface StopContext {
  messages: readonly Message[]
  step: StopStep
  steps: readonly StopStep[]
}

export interface StopStep {
  finishReason: FinishReason
  text?: string
  toolCalls: CompletionToolCall[]
  toolResults: CompletionToolResult[]
  usage?: Usage
}
