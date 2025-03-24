import type { Message, ToolMessagePart } from './message'

export interface CompletionToolCall {
  args: string
  toolCallId: string
  toolCallType: 'function'
  toolName: string
}

export interface CompletionToolResult {
  args: Record<string, unknown>
  result: string | ToolMessagePart[]
  toolCallId: string
  toolName: string
}

export interface Tool {
  execute: (input: unknown, options: ToolExecuteOptions) => (object | string | unknown[]) | Promise<object | string | unknown[]>
  function: {
    description?: string
    name: string
    parameters: Record<string, unknown>
    /** @experimental */
    returns?: Record<string, unknown>
    strict?: boolean
  }
  type: 'function'
}

export interface ToolExecuteOptions {
  abortSignal?: AbortSignal
  messages: Message[]
  toolCallId: string
}
