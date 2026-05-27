import type { Message } from './message'
import type { CompletionToolCall, CompletionToolResult } from './tool'

export interface ToolCallControl {
  postToolCall?: (toolResult: CompletionToolResult, context: ToolCallControlContext) => CompletionToolResult | Promise<CompletionToolResult | void> | void
  preToolCall?: (toolCall: CompletionToolCall, context: ToolCallControlContext) => CompletionToolCall | CompletionToolResult | Promise<CompletionToolCall | CompletionToolResult | void> | void
}

export interface ToolCallControlContext {
  abortSignal?: AbortSignal
  messages: Message[]
}
