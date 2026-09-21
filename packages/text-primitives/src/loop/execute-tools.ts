import type { Promisable } from '@xsai/shared'

import type { ExecutableTool, ToolExecuteOptions } from '../core/tool'
import type { ToolCallPart, ToolResultPart } from '../core/types/content'
import type { FinishReason } from '../core/types/finish-reason'
import type { LanguageModelOptions } from '../core/types/language-model'

export interface ExecuteToolOptions extends Pick<LanguageModelOptions, 'signal' | 'tools'> {
  postToolCall?: PostToolCall
  preToolCall?: PreToolCall
}

export interface ExecuteToolsOptions extends ExecuteToolOptions {
  /** Finish reason of the step that produced the tool calls. */
  reason?: FinishReason
  toolCalls: ToolCallPart[]
}

export type PostToolCall = (toolResult: ToolResultPart, options: ToolExecuteOptions) => Promisable<ToolResultPart | void>

export type PreToolCall = (toolCall: ToolCallPart, options: ToolExecuteOptions) => Promisable<ToolCallPart | ToolResultPart | void>

const toolError = (call: ToolCallPart, detail: string): ToolResultPart => ({
  callId: call.callId,
  isError: true,
  output: `Tool "${call.name}" execution failed: ${detail}`,
  type: 'tool-result',
})

const assertSameCallId = (source: string, next: string): void => {
  if (source !== next)
    throw new Error(`Tool call hooks must preserve callId "${source}".`)
}

const catchToolError = async <T>(call: ToolCallPart, signal: AbortSignal | undefined, callback: () => Promisable<T>): Promise<T | ToolResultPart> => {
  try {
    return await callback()
  }
  catch (error) {
    signal?.throwIfAborted()
    return toolError(call, error instanceof Error ? error.message : String(error))
  }
}

export const executeTool = async (
  call: ToolCallPart,
  { postToolCall, preToolCall, signal, tools }: ExecuteToolOptions,
): Promise<ToolResultPart> => {
  const executeOptions: ToolExecuteOptions = { signal }
  const preToolCallResult = await catchToolError(call, signal, async () => preToolCall?.(call, executeOptions))
  if (preToolCallResult != null) {
    assertSameCallId(call.callId, preToolCallResult.callId)
    if (preToolCallResult.type === 'tool-result')
      return preToolCallResult

    call = preToolCallResult
  }

  let shouldPostToolCall = false
  const toolResult = await catchToolError(call, signal, async () => {
    const tool = tools?.find(candidate => candidate.name === call.name)
    const executableTool = tool as ExecutableTool | undefined

    if (executableTool == null || executableTool.execute == null) {
      const available = tools?.map(candidate => candidate.name).join(', ')
      return toolError(call, tool == null
        ? `Model tried to call unavailable tool "${call.name}", ${available == null || available === '' ? 'No tools are available' : `Available tools: ${available}`}.`
        : `Tool "${call.name}" is not executable.`)
    }

    let toolInput: unknown
    try {
      toolInput = JSON.parse(call.arguments.trim() || '{}') as unknown
    }
    catch {
      return toolError(call, 'Failed to parse tool input.')
    }

    let validatedInput = toolInput
    if (executableTool.inputSchema.validate != null) {
      const validation = await executableTool.inputSchema.validate(toolInput)
      if (validation.issues)
        return toolError(call, `Tool input validation failed for "${call.name}".`)
      validatedInput = validation.value
    }

    shouldPostToolCall = true
    return {
      callId: call.callId,
      output: await executableTool.execute(validatedInput, { signal }),
      type: 'tool-result' as const,
    }
  })

  if (!shouldPostToolCall || postToolCall == null)
    return toolResult

  const postToolCallResult = await catchToolError(call, signal, async () => postToolCall(toolResult, executeOptions))
  if (postToolCallResult == null)
    return toolResult

  assertSameCallId(toolResult.callId, postToolCallResult.callId)
  return postToolCallResult
}

export const executeTools = async ({ reason, toolCalls, ...options }: ExecuteToolsOptions): Promise<ToolResultPart[]> =>
  reason === 'length'
    ? toolCalls.map(call => toolError(call, 'The response reached the output token limit before the tool call was complete.'))
    : Promise.all(toolCalls.map(async call => executeTool(call, options)))
