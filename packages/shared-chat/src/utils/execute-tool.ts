import type { Message, Tool, ToolCall, ToolMessagePart } from '../types'

import { wrapToolResult } from './internal/wrap-tool-result'

export interface ExecuteToolOptions {
  abortSignal?: AbortSignal
  messages: Message[]
  toolCall: ToolCall
  tools?: Tool[]
}

export interface ExecuteToolResult {
  parsedArgs: Record<string, unknown>
  result: string | ToolMessagePart[]
  toolName: string
}

export const executeTool = async ({ abortSignal, messages, toolCall, tools }: ExecuteToolOptions): Promise<ExecuteToolResult> => {
  const tool = tools?.find(tool => tool.function.name === toolCall.function.name)

  if (!tool) {
    const availableTools = tools?.map(tool => tool.function.name)
    const availableToolsErrorMsg = (availableTools == null || availableTools.length === 0)
      ? 'No tools are available.'
      : `Available tools: ${availableTools.join(', ')}.`
    throw new Error(`Model tried to call unavailable tool '${toolCall.function.name}. ${availableToolsErrorMsg}.`)
  }

  const parsedArgs = JSON.parse(toolCall.function.arguments) as Record<string, unknown>
  const result = wrapToolResult(await tool.execute(parsedArgs, {
    abortSignal,
    messages,
    toolCallId: toolCall.id,
  }))

  return { parsedArgs, result, toolName: toolCall.function.name }
}
