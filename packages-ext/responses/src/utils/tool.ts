import type { Tool } from '@xsai/shared-chat'

import type { FunctionCallOutput, FunctionTool } from '../generated'

export interface ExecutableTool extends FunctionTool {
  execute: (input: unknown, options: ToolExecuteOptions) => Promise<ToolExecuteResult> | ToolExecuteResult
}

export type OpenResponsesTool = ExecutableTool | Tool

export interface ToolExecuteOptions {
  abortSignal?: AbortSignal
  // input: ItemParam[]
  toolCallId: string
}

export type ToolExecuteResult = FunctionCallOutput['output']

export const isChatTool = (tool: OpenResponsesTool): tool is Tool =>
  'function' in tool

export const normalizeTool = (tool: OpenResponsesTool): ExecutableTool =>
  isChatTool(tool)
    ? {
        description: tool.function.description ?? null,
        execute: async (input, options) => tool.execute(input, {
          abortSignal: options.abortSignal,
          messages: [],
          toolCallId: options.toolCallId,
        }) as Promise<ToolExecuteResult> | ToolExecuteResult,
        name: tool.function.name,
        parameters: tool.function.parameters,
        strict: tool.function.strict ?? true,
        type: 'function',
      }
    : tool
