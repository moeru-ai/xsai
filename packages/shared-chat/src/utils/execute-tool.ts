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

import { InvalidToolCallError, InvalidToolInputError } from '@xsai/shared'

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

const parseToolInput = async (tool: Tool, input: string): Promise<unknown> => {
  let result: unknown

  try {
    result = JSON.parse(input.trim() || '{}') as unknown
  }
  catch (cause) {
    throw new InvalidToolInputError(`Failed to parse tool input for "${tool.function.name}".`, {
      cause,
      toolInput: input,
      toolName: tool.function.name,
    })
  }

  if (tool.validate) {
    const validated = await tool.validate(result)

    if (validated.issues) {
      throw new InvalidToolInputError(`Tool input validation failed for "${tool.function.name}".`, {
        cause: validated.issues,
        toolInput: result,
        toolName: tool.function.name,
      })
    }

    result = validated.value
  }

  return result
}

const createErrorToolResult = (toolCall: CompletionToolCall | CompletionToolResult, args: unknown, cause: unknown, abortSignal?: AbortSignal): CompletionToolResult => ({
  args,
  isError: true,
  result: `Tool "${toolCall.toolName}" execution failed: ${abortSignal?.aborted === true ? 'This operation was aborted' : cause instanceof Error ? cause.message : String(cause)}`,
  toolCallId: toolCall.toolCallId,
  toolName: toolCall.toolName,
})

const catchToolError = async <T, C extends CompletionToolCall | CompletionToolResult>(toolCall: C, abortSignal: AbortSignal | undefined, callback: (toolCall: C) => Promise<T> | T): Promise<CompletionToolResult | T> => {
  try {
    return await callback(toolCall)
  }
  catch (cause) {
    return createErrorToolResult(toolCall, InvalidToolInputError.isInstance(cause) ? cause.toolInput : toolCall.args, cause, abortSignal)
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
  let parsedArgs: unknown
  let shouldPostToolCall = false

  // preToolCall
  const preToolCallResult = await catchToolError(completionToolCall, abortSignal, async toolCall => preToolCall?.(toolCall, toolExecuteOptions))
  if (preToolCallResult) {
    assertSameToolCallId(completionToolCall.toolCallId, preToolCallResult, 'preToolCallResult')

    if ('result' in preToolCallResult) // CompletionToolResult
      completionToolResult = preToolCallResult
    else // CompletionToolCall
      completionToolCall = preToolCallResult
  }

  completionToolResult ??= await catchToolError(completionToolCall, abortSignal, async () => {
    const tool = findTool(tools, completionToolCall.toolName, completionToolCall)
    parsedArgs = await parseToolInput(tool, completionToolCall.args)

    if (abortSignal?.aborted === true)
      return createErrorToolResult(completionToolCall, parsedArgs, abortSignal.reason, abortSignal)

    shouldPostToolCall = true
    const result = await tool.execute(parsedArgs, toolExecuteOptions)

    return {
      args: parsedArgs,
      result,
      toolCallId: completionToolCall.toolCallId,
      toolName: completionToolCall.toolName,
    }
  })

  // postToolCall
  if (shouldPostToolCall) {
    completionToolResult.args = parsedArgs
    const postToolCallResult = await catchToolError(completionToolResult, abortSignal, async toolResult => postToolCall?.(toolResult, toolExecuteOptions))
    if (postToolCallResult) {
      assertSameToolCallId(completionToolResult.toolCallId, postToolCallResult, 'postToolCallResult')
      completionToolResult = postToolCallResult
    }
  }

  return {
    completionToolCall,
    completionToolResult,
    result: wrap(completionToolResult.result),
  }
}
