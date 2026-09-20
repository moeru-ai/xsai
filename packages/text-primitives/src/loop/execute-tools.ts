import type { ExecutableTool } from '../core/tool'
import type { ToolCallPart, ToolResultPart } from '../core/types/content'
import type { StopReason } from '../core/types/finish-reason'
import type { LanguageModelOptions } from '../core/types/language-model'

export interface ExecuteToolsOptions extends Pick<LanguageModelOptions, 'signal' | 'tools'> {
  /** Finish reason of the step that produced the tool calls. */
  reason?: StopReason
  toolCalls: ToolCallPart[]
}

const toolError = (call: ToolCallPart, detail: string): ToolResultPart => ({
  callId: call.callId,
  isError: true,
  output: `Tool "${call.name}" execution failed: ${detail}`,
  type: 'tool-result',
})

export const executeTool = async (
  call: ToolCallPart,
  { signal, tools }: Pick<LanguageModelOptions, 'signal' | 'tools'>,
): Promise<ToolResultPart> => {
  const tool = tools?.find(candidate => candidate.name === call.name)
  const execute = (tool as Partial<ExecutableTool> | undefined)?.execute

  if (execute == null) {
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

  try {
    return {
      callId: call.callId,
      output: await execute(toolInput, { signal }),
      type: 'tool-result',
    }
  }
  catch (error) {
    signal?.throwIfAborted()
    return toolError(call, error instanceof Error ? error.message : String(error))
  }
}

export const executeTools = async ({ reason, toolCalls, ...options }: ExecuteToolsOptions): Promise<ToolResultPart[]> =>
  reason === 'length'
    ? toolCalls.map(call => toolError(call, 'The response reached the output token limit before the tool call was complete.'))
    : Promise.all(toolCalls.map(async call => executeTool(call, options)))
