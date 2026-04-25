import type { FunctionCall, FunctionCallOutput } from '../generated'
import type { OpenResponsesTool, ToolExecuteResult } from './tool'

import { InvalidToolCallError, InvalidToolInputError, ToolExecutionError } from '@xsai/shared'

import { normalizeTool } from './tool'

export interface ExecuteToolOptions {
  abortSignal?: AbortSignal
  functionCall: FunctionCall
  tools?: OpenResponsesTool[]
}

const normalizeToolOutput = (output: object | ToolExecuteResult | unknown[]): FunctionCallOutput['output'] =>
  typeof output === 'string' ? output : JSON.stringify(output)

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

export const executeTool = async ({ abortSignal, functionCall, tools }: ExecuteToolOptions): Promise<FunctionCallOutput> => {
  const normalizedTools = tools?.map(tool => normalizeTool(tool))
  const tool = normalizedTools?.find(tool => tool.name === functionCall.name)

  if (!tool) {
    const availableTools = normalizedTools?.map(tool => tool.name)
    const availableToolsErrorMsg = (availableTools == null || availableTools.length === 0)
      ? 'No tools are available'
      : `Available tools: ${availableTools.join(', ')}`
    throw new InvalidToolCallError(`Model tried to call unavailable tool "${functionCall.name}", ${availableToolsErrorMsg}.`, {
      availableTools,
      reason: 'unknown_tool',
      toolCall: functionCall,
      toolName: functionCall.name,
    })
  }

  const parsedArgs = parseToolInput(functionCall.name, functionCall.arguments)

  let toolResult: ToolExecuteResult
  try {
    toolResult = await tool.execute(parsedArgs, {
      abortSignal,
      toolCallId: functionCall.call_id,
    })
  }
  catch (cause) {
    if (isAbortError(cause, abortSignal))
      throw cause

    throw new ToolExecutionError(`Tool "${tool.name}" execution failed.`, {
      cause,
      toolCallId: functionCall.call_id,
      toolInput: parsedArgs,
      toolName: tool.name,
    })
  }

  return {
    call_id: functionCall.call_id,
    id: crypto.randomUUID(),
    output: normalizeToolOutput(toolResult),
    status: 'completed',
    type: 'function_call_output',
  }
}
