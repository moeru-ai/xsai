import type { Message } from './message'

export interface CompletionToolCall {
  args: string
  toolCallId: string
  toolCallType: 'function'
  toolName: string
}

export interface CompletionToolResult {
  args: unknown
  result: ToolExecuteResult
  toolCallId: string
  toolName: string
}

export type PostToolCall = (toolResult: CompletionToolResult, options: ToolExecuteOptions) =>
  | CompletionToolResult
  | Promise<CompletionToolResult | void>
  | void

export type PreToolCall = (toolCall: CompletionToolCall, options: ToolExecuteOptions) =>
  | CompletionToolCall
  | CompletionToolResult
  | Promise<CompletionToolCall | CompletionToolResult | void>
  | void

export interface Tool {
  execute: (input: unknown, options: ToolExecuteOptions) => Promise<ToolExecuteResult> | ToolExecuteResult
  function: {
    description?: string
    name: string
    parameters: Record<string, unknown>
    strict?: boolean
  }
  type: 'function'
  validate?: (input: unknown) => Promise<ToolValidateResult> | ToolValidateResult
}

export interface ToolExecuteOptions {
  abortSignal?: AbortSignal
  messages: Message[]
  toolCallId: string
}

export type ToolExecuteResult = object | string | unknown[]

export interface ToolValidateFailure {
  readonly issues: readonly { readonly message: string }[]
}

export type ToolValidateResult = ToolValidateFailure | ToolValidateSuccess

export interface ToolValidateSuccess {
  readonly issues?: never
  readonly value: unknown
}
