import type { CompletionToolCall, CompletionToolResult, FinishReason, StepType, Usage } from '@xsai/shared-chat'

// export interface StreamTextStep {
//   choices: StreamTextChoice[]
//   finishReason: FinishReason
//   messages: Message[]
//   stepType: StepType
//   toolCalls: CompletionToolCall[]
//   toolResults: CompletionToolResult[]
//   usage?: Usage
// }

export interface StreamTextStepResult {
  finishReason: FinishReason
  stepType: StepType
  text?: string
  toolCalls: CompletionToolCall[]
  toolResults: CompletionToolResult[]
  usage: Usage
}
