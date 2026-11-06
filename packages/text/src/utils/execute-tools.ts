import type { Promisable } from '@xsai/shared'

import type { ExecutableTool, ToolExecuteOptions } from '../tool'
import type { ToolCallPart, ToolResultPart } from '../types/content'
import type { FinishReason } from '../types/finish-reason'
import type { LanguageModelOptions } from '../types/language-model'

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

const attempt = async <T>(call: ToolCallPart, signal: AbortSignal | undefined, callback: () => Promisable<T>): Promise<T | ToolResultPart> => {
  try {
    return await callback()
  }
  catch (error) {
    signal?.throwIfAborted()
    return toolError(call, error instanceof Error ? error.message : String(error))
  }
}

const parseInput = (args: string): unknown => {
  try {
    return JSON.parse(args.trim() || '{}')
  }
  catch {
    throw new Error('Failed to parse tool input.')
  }
}

const runTool = async (call: ToolCallPart, tools: ExecuteToolOptions['tools'], options: ToolExecuteOptions): Promise<ToolResultPart> => {
  const tool = tools?.find(candidate => candidate.name === call.name) as ExecutableTool | undefined
  if (tool == null) {
    const available = tools?.map(candidate => candidate.name).join(', ')
    throw new Error(`Model tried to call unavailable tool "${call.name}", ${available == null || available === '' ? 'No tools are available' : `Available tools: ${available}`}.`)
  }
  if (tool.execute == null)
    throw new Error(`Tool "${call.name}" is not executable.`)

  let input = parseInput(call.arguments)
  if (tool.inputSchema.validate != null) {
    const validation = await tool.inputSchema.validate(input)
    if (validation.issues)
      throw new Error(`Tool input validation failed for "${call.name}": ${validation.issues.map(issue => issue.message).join('; ')}`)
    input = validation.value
  }

  return { callId: call.callId, output: await tool.execute(input, options), type: 'tool-result' }
}

export const executeTool = async (
  call: ToolCallPart,
  { postToolCall, preToolCall, signal, tools }: ExecuteToolOptions,
): Promise<ToolResultPart> => {
  const options: ToolExecuteOptions = { callId: call.callId, signal }

  const prepared = await attempt(call, signal, async () => preToolCall?.(call, options))
  if (prepared != null) {
    assertSameCallId(call.callId, prepared.callId)
    if (prepared.type === 'tool-result')
      return prepared
    call = prepared
  }

  const result = await attempt(call, signal, async () => runTool(call, tools, options))

  const posted = await attempt(call, signal, async () => postToolCall?.(result, options))
  if (posted == null)
    return result
  assertSameCallId(result.callId, posted.callId)
  return posted
}

export const executeTools = async ({ reason, toolCalls, ...options }: ExecuteToolsOptions): Promise<ToolResultPart[]> =>
  reason === 'length'
    ? toolCalls.map(call => toolError(call, 'The response reached the output token limit before the tool call was complete.'))
    : Promise.all(toolCalls.map(async call => executeTool(call, options)))
