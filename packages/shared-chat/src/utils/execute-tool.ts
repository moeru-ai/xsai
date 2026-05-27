import type { CompletionToolCall, CompletionToolResult, Message, Tool, ToolCall, ToolCallControl, ToolCallControlContext, ToolExecuteResult, ToolMessage } from '../types'

import { InvalidToolCallError, InvalidToolInputError, ToolExecutionError } from '@xsai/shared'

import { toToolMessageContent } from './internal/to-tool-message-content'

export interface ExecuteToolOptions<T = ToolMessage['content']> {
  abortSignal?: AbortSignal
  experimentalToolCallControl?: ToolCallControl
  messages: Message[]
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
  abortSignal?: AbortSignal
  messages: Message[]
  parsedArgs: Record<string, unknown>
  toolCallId: string
}) => {
  try {
    return await tool.execute(options.parsedArgs, {
      abortSignal: options.abortSignal,
      messages: options.messages,
      toolCallId: options.toolCallId,
    })
  }
  catch (cause) {
    if (isAbortError(cause, options.abortSignal))
      throw cause

    throw new ToolExecutionError(`Tool "${tool.function.name}" execution failed.`, {
      cause,
      toolCallId: options.toolCallId,
      toolInput: options.parsedArgs,
      toolName: tool.function.name,
    })
  }
}

const toCompletionToolCall = (toolCall: ToolCall, toolName: string, toolArguments: string): CompletionToolCall => ({
  args: toolArguments,
  toolCallId: toolCall.id,
  toolCallType: toolCall.type,
  toolName,
})

const toCompletionToolResult = (toolCall: CompletionToolCall, parsedArgs: Record<string, unknown>, result: ToolExecuteResult): CompletionToolResult => ({
  args: parsedArgs,
  result,
  toolCallId: toolCall.toolCallId,
  toolName: toolCall.toolName,
})

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value != null

const isCompletionToolCall = (value: unknown): value is CompletionToolCall =>
  isObject(value)
  && typeof value.args === 'string'
  && typeof value.toolCallId === 'string'
  && value.toolCallType === 'function'
  && typeof value.toolName === 'string'
  && !('result' in value)

const isCompletionToolResult = (value: unknown): value is CompletionToolResult =>
  isObject(value)
  && isObject(value.args)
  && 'result' in value
  && typeof value.toolCallId === 'string'
  && typeof value.toolName === 'string'

const assertSameToolCallId = (source: string, next: string, label: string) => {
  if (source === next)
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

const applyPostToolCall = async (control: ToolCallControl | undefined, toolResult: CompletionToolResult, context: ToolCallControlContext): Promise<CompletionToolResult> => {
  const next = await control?.postToolCall?.(toolResult, context)

  if (next == null)
    return toolResult

  assertSameToolCallId(toolResult.toolCallId, next.toolCallId, 'postToolCall result')
  return next
}

export const executeTool = async <T = ToolMessage['content']>({ abortSignal, experimentalToolCallControl, messages, toolCall, tools, wrapResult }: ExecuteToolOptions<T>): Promise<ExecuteToolResult<T>> => {
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

  const controlContext: ToolCallControlContext = {
    abortSignal,
    messages,
  }
  const wrap = wrapResult ?? toToolMessageContent as (result: ToolExecuteResult) => T
  const originalCompletionToolCall = toCompletionToolCall(toolCall, toolName, toolArguments)
  const preResult = await experimentalToolCallControl?.preToolCall?.(originalCompletionToolCall, controlContext)

  if (isCompletionToolResult(preResult)) {
    assertSameToolCallId(originalCompletionToolCall.toolCallId, preResult.toolCallId, 'preToolCall result')
    const completionToolResult = await applyPostToolCall(experimentalToolCallControl, preResult, controlContext)

    return {
      completionToolCall: originalCompletionToolCall,
      completionToolResult,
      result: wrap(completionToolResult.result),
    }
  }

  const completionToolCall = preResult ?? originalCompletionToolCall
  if (!isCompletionToolCall(completionToolCall)) {
    throw new InvalidToolCallError(`preToolCall returned an invalid tool call: ${JSON.stringify(preResult)}`, {
      reason: 'invalid_tool_call',
      toolCall: preResult,
    })
  }

  assertSameToolCallId(originalCompletionToolCall.toolCallId, completionToolCall.toolCallId, 'preToolCall tool call')

  const tool = findTool(tools, completionToolCall.toolName, completionToolCall)
  const parsedArgs = parseToolInput(completionToolCall.toolName, completionToolCall.args)

  const result = await runTool(tool, {
    abortSignal,
    messages,
    parsedArgs,
    toolCallId: completionToolCall.toolCallId,
  })
  const completionToolResult = await applyPostToolCall(
    experimentalToolCallControl,
    toCompletionToolResult(completionToolCall, parsedArgs, result),
    controlContext,
  )

  return {
    completionToolCall,
    completionToolResult,
    result: wrap(completionToolResult.result),
  }
}
