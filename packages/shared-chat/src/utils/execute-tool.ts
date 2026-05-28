import type {
  CompletionToolCall,
  CompletionToolResult,
  Message,
  PostToolCall,
  PreToolCall,
  Tool,
  ToolCall,
  ToolExecuteOptions,
  ToolExecuteResult,
  ToolMessage,
} from '../types'

import { InvalidToolCallError, InvalidToolInputError, ToolExecutionError } from '@xsai/shared'

import { toToolMessageContent } from './internal/to-tool-message-content'

export interface ExecuteToolOptions<T = ToolMessage['content']> {
  abortSignal?: AbortSignal
  messages: Message[]
  postToolCall?: PostToolCall
  preToolCall?: PreToolCall
  toolCall: ToolCall
  tools?: Tool[]
  wrapResult?: (result: ToolExecuteResult) => T
}

export interface ExecuteToolResult<T = ToolMessage['content']> {
  completionToolCall: CompletionToolCall
  completionToolResult: CompletionToolResult
  result: T
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
  parsedArgs: Record<string, unknown>
  toolExecuteOptions: ToolExecuteOptions
}) => {
  try {
    return await tool.execute(options.parsedArgs, options.toolExecuteOptions)
  }
  catch (cause) {
    if (isAbortError(cause, options.toolExecuteOptions.abortSignal))
      throw cause

    throw new ToolExecutionError(`Tool "${tool.function.name}" execution failed.`, {
      cause,
      toolCallId: options.toolExecuteOptions.toolCallId,
      toolInput: options.parsedArgs,
      toolName: tool.function.name,
    })
  }
}

const assertSameToolCallId = (source: string, next: CompletionToolCall | CompletionToolResult, label: string) => {
  if (source === next.toolCallId)
    return

  throw new InvalidToolCallError(`${label} must preserve toolCallId "${source}".`, {
    reason: 'tool_call_id_mismatch',
    toolCall: next,
  })
}

const findTool = (tools: Tool[] | undefined, toolName: string, toolCall: CompletionToolCall) => {
  const tool = tools?.find(tool => tool.function.name === toolName)

  if (!tool) {
    const availableTools = tools?.map(tool => tool.function.name)
    const availableToolsErrorMsg = (availableTools == null || availableTools.length === 0)
      ? 'No tools are available'
      : `Available tools: ${availableTools.join(', ')}`

    throw new InvalidToolCallError(`Model tried to call unavailable tool "${toolName}", ${availableToolsErrorMsg}.`, {
      availableTools,
      reason: 'unknown_tool',
      toolCall,
      toolName,
    })
  }

  return tool
}

export const executeTool = async <T = ToolMessage['content']>({ abortSignal, messages, postToolCall, preToolCall, toolCall, tools, wrapResult }: ExecuteToolOptions<T>): Promise<ExecuteToolResult<T>> => {
  const wrap = wrapResult ?? toToolMessageContent as (result: ToolExecuteResult) => T

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

  const toolExecuteOptions: ToolExecuteOptions = {
    abortSignal,
    messages,
    toolCallId: toolCall.id,
  }

  let completionToolCall: CompletionToolCall = {
    args: toolArguments,
    toolCallId: toolCall.id,
    toolCallType: 'function',
    toolName,
  }
  let completionToolResult: CompletionToolResult | undefined

  // preToolCall
  const preToolCallResult = await preToolCall?.(completionToolCall, toolExecuteOptions)
  if (preToolCallResult) {
    assertSameToolCallId(completionToolCall.toolCallId, preToolCallResult, 'preToolCallResult')

    if ('result' in preToolCallResult) // CompletionToolResult
      completionToolResult = preToolCallResult
    else // CompletionToolCall
      completionToolCall = preToolCallResult
  }

  if (completionToolResult == null) {
    const tool = findTool(tools, completionToolCall.toolName, completionToolCall)
    const parsedArgs = parseToolInput(completionToolCall.toolName, completionToolCall.args)

    const result = await runTool(tool, {
      parsedArgs,
      toolExecuteOptions,
    })

    completionToolResult = {
      args: parsedArgs,
      result,
      toolCallId: completionToolCall.toolCallId,
      toolName: completionToolCall.toolName,
    }
  }

  // postToolCall
  const postToolCallResult = await postToolCall?.(completionToolResult, toolExecuteOptions)
  if (postToolCallResult) {
    assertSameToolCallId(completionToolResult.toolCallId, postToolCallResult, 'postToolCallResult')
    completionToolResult = postToolCallResult
  }

  return {
    completionToolCall,
    completionToolResult,
    result: wrap(completionToolResult.result),
  }
}
