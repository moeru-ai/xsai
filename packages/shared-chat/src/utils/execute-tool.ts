import type { CompletionToolCall, CompletionToolResult, Message, Tool, ToolCall, ToolMessage } from '../types'

import { InvalidToolCallError, InvalidToolInputError, NoSuchToolError, ToolExecutionError } from '@xsai/shared'

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

const isAbortError = (error: unknown, abortSignal?: AbortSignal) =>
  (abortSignal?.aborted === true && error === abortSignal.reason)
  || (error instanceof Error && error.name === 'AbortError')

const parseToolInput = (toolName: string, input: string) => {
  try {
    return JSON.parse(input.trim() || '{}') as Record<string, unknown>
  }
  catch (cause) {
    throw new InvalidToolInputError(`Failed to parse tool input for "${toolName}".`, {
      cause,
      toolInput: input,
      toolName,
    })
  }
}

const runTool = async (tool: Tool, options: {
  abortSignal?: AbortSignal
  messages: Message[]
  parsedArgs: Record<string, unknown>
  toolCall: ToolCall
}) => {
  try {
    return wrapToolResult(await tool.execute(options.parsedArgs, {
      abortSignal: options.abortSignal,
      messages: options.messages,
      toolCallId: options.toolCall.id,
    }))
  }
  catch (cause) {
    if (isAbortError(cause, options.abortSignal))
      throw cause

    throw new ToolExecutionError(`Tool "${tool.function.name}" execution failed.`, {
      cause,
      toolCallId: options.toolCall.id,
      toolInput: options.parsedArgs,
      toolName: tool.function.name,
    })
  }
}

export const executeTool = async ({ abortSignal, messages, toolCall, tools }: ExecuteToolOptions): Promise<ExecuteToolResult> => {
  const toolName = toolCall.function.name
  const toolArguments = toolCall.function.arguments

  if (toolName == null) {
    throw new InvalidToolCallError(`Missing toolCall.function.name: ${JSON.stringify(toolCall)}`, {
      reason: 'missing_name',
      toolCall,
    })
  }

  if (toolArguments == null) {
    throw new InvalidToolCallError(`Missing toolCall.function.arguments: ${JSON.stringify(toolCall)}`, {
      reason: 'missing_arguments',
      toolCall,
    })
  }

  const tool = tools?.find(tool => tool.function.name === toolName)

  if (!tool) {
    const availableTools = tools?.map(tool => tool.function.name)
    const availableToolsErrorMsg = (availableTools == null || availableTools.length === 0)
      ? 'No tools are available'
      : `Available tools: ${availableTools.join(', ')}`
    throw new NoSuchToolError(`Model tried to call unavailable tool "${toolName}", ${availableToolsErrorMsg}.`, {
      availableTools,
      toolName,
    })
  }

  const parsedArgs = parseToolInput(toolName, toolArguments)
  const result = await runTool(tool, { abortSignal, messages, parsedArgs, toolCall })

  const completionToolCall: CompletionToolCall = {
    args: toolArguments,
    toolCallId: toolCall.id,
    toolCallType: toolCall.type,
    toolName,
  }

  const completionToolResult: CompletionToolResult = {
    args: parsedArgs,
    result,
    toolCallId: toolCall.id,
    toolName,
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
