import type { Message, ToolMessage } from './message'

export interface CompletionToolCall {
  args: string
  toolCallId: string
  toolCallType: 'function'
  toolName: string
}

export interface CompletionToolResult {
  args: Record<string, unknown>
  result: ToolMessage['content']
  toolCallId: string
  toolName: string
}

export interface Tool {
  execute: (input: unknown, options: ToolExecuteOptions) => Promise<ToolExecuteResult> | ToolExecuteResult
  function: {
    description?: string
    name: string
    parameters: Record<string, unknown>
    strict?: boolean
  }
  type: 'function'
}

export interface ToolExecuteOptions {
  abortSignal?: AbortSignal
  messages: Message[]
  toolCallId: string
}

export type ToolExecuteResult = object | string | unknown[]
