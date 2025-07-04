import type { CompletionToolCall, CompletionToolResult, Message, Tool, ToolCall, ToolMessage, ToolMessagePart } from '../types'

import { wrapToolResult } from './internal/wrap-tool-result'

export interface ExecuteToolOptions {
  abortSignal?: AbortSignal
  messages: Message[]
  toolCall: ToolCall
  tools?: Tool[]
}

// TODO: remove parsedArgs, result when 'stream-text/experimental' is stable
export interface ExecuteToolResult {
  completionToolCall: CompletionToolCall
  completionToolResult: CompletionToolResult
  message: ToolMessage
  parsedArgs: Record<string, unknown>
  result: string | ToolMessagePart[]
  toolName: string
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

  const toolCallId = toolCall.id
  const toolName = toolCall.function.name

  const parsedArgs = JSON.parse(toolCall.function.arguments) as Record<string, unknown>
  const result = wrapToolResult(await tool.execute(parsedArgs, {
    abortSignal,
    messages,
    toolCallId,
  }))

  const completionToolCall: CompletionToolCall = {
    args: toolCall.function.arguments,
    toolCallId,
    toolCallType: toolCall.type,
    toolName,
  }

  const completionToolResult: CompletionToolResult = {
    args: parsedArgs,
    result,
    toolCallId,
    toolName,
  }

  const message: ToolMessage = {
    content: result,
    role: 'tool',
    tool_call_id: toolCallId,
  }

  return {
    completionToolCall,
    completionToolResult,
    message,
    parsedArgs,
    result,
    toolName,
  }
}
