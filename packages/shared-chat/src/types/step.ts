import type { FinishReason } from './finish-reason'
import type { CompletionToolCall, CompletionToolResult } from './tool'
import type { Usage } from './usage'

export interface CompletionStep<T extends boolean = false> {
  finishReason: FinishReason
  stepType: CompletionStepType
  text?: string
  toolCalls: CompletionToolCall[]
  toolResults: CompletionToolResult[]
  usage: T extends true
    ? Usage
    : undefined | Usage
}

export type CompletionStepType = 'continue' | 'done' | 'initial' | 'tool-result'
