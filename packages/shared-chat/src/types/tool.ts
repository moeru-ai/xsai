import type { Message } from './message'

export interface Tool {
  execute: (input: unknown, options: ToolExecuteOptions) => Promise<string> | string
  function: {
    description?: string
    name: string
    parameters: Record<string, unknown>
    strict?: boolean
  }
  type: 'function'
}

interface ToolExecuteOptions {
  abortSignal?: AbortSignal
  messages: Message[]
  toolCallId: string
}
