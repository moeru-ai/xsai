import type { CompletionToolCall, CompletionToolResult, FinishReason, StepType, Usage } from '@xsai/shared-chat'

export interface StreamTextStep {
  finishReason: FinishReason
  stepType: StepType
  text?: string
  toolCalls: CompletionToolCall[]
  toolResults: CompletionToolResult[]
  usage?: Usage
}
