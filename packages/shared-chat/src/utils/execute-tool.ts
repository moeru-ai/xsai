import type { CompletionToolCall, CompletionToolResult, Message, Tool, ToolCall, ToolMessage } from '../types'

import { wrapToolResult } from './internal/wrap-tool-result'

export interface ExecuteToolOptions {
  abortSignal?: AbortSignal
  messages: Message[]
  toolCall: ToolCall
  tools?: Tool[]
}

export interface ExecuteToolResult {
  completionToolCall: CompletionToolCall
  completionToolResult: CompletionToolResult
  message: ToolMessage
}

export const executeTool = async ({ abortSignal, messages, toolCall, tools }: ExecuteToolOptions): Promise<ExecuteToolResult> => {
  const tool = tools?.find(tool => tool.function.name === toolCall.function.name)

  if (!tool) {
    const availableTools = tools?.map(tool => tool.function.name)
    const availableToolsErrorMsg = (availableTools == null || availableTools.length === 0)
      ? 'No tools are available'
      : `Available tools: ${availableTools.join(', ')}`
    throw new Error(`Model tried to call unavailable tool "${toolCall.function.name}", ${availableToolsErrorMsg}.`)
  }

  if (toolCall.function.name == null)
    throw new Error(`Missing toolCall.function.name: ${JSON.stringify(toolCall)}`)

  if (toolCall.function.arguments == null)
    throw new Error(`Missing toolCall.function.arguments: ${JSON.stringify(toolCall)}`)

  const parsedArgs = JSON.parse(toolCall.function.arguments) as Record<string, unknown>
  const result = wrapToolResult(await tool.execute(parsedArgs, {
    abortSignal,
    messages,
    toolCallId: toolCall.id,
  }))

  const completionToolCall: CompletionToolCall = {
    args: toolCall.function.arguments,
    toolCallId: toolCall.id,
    toolCallType: toolCall.type,
    toolName: toolCall.function.name,
  }

  const completionToolResult: CompletionToolResult = {
    args: parsedArgs,
    result,
    toolCallId: toolCall.id,
    toolName: toolCall.function.name,
  }

  const message: ToolMessage = {
    content: result,
    role: 'tool',
    tool_call_id: toolCall.id,
  }

  return {
    completionToolCall,
    completionToolResult,
    message,
  }
}
