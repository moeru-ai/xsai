import type { FinishReason } from './finish-reason'
import type { CompletionToolCall, CompletionToolResult } from './tool'
import type { Usage } from './usage'

export type CompletionStep<T extends boolean = false> = (T extends true ? { usage: Usage } : { usage?: Usage }) & {
  finishReason: FinishReason
  stepType: CompletionStepType
  text?: string
  toolCalls: CompletionToolCall[]
  toolResults: CompletionToolResult[]
}

export type CompletionStepType = 'continue' | 'done' | 'initial' | 'tool-result'
