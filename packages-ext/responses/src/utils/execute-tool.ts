import type { FunctionCall, FunctionCallOutput } from '../generated'
import type { OpenResponsesTool, ToolExecuteResult } from './tool'

import { normalizeTool } from './tool'

export interface ExecuteToolOptions {
  abortSignal?: AbortSignal
  functionCall: FunctionCall
  tools?: OpenResponsesTool[]
}

const normalizeToolOutput = (output: object | ToolExecuteResult | unknown[]): FunctionCallOutput['output'] =>
  typeof output === 'string' ? output : JSON.stringify(output)

export const executeTool = async ({ abortSignal, functionCall, tools }: ExecuteToolOptions): Promise<FunctionCallOutput> => {
  const normalizedTools = tools?.map(tool => normalizeTool(tool))
  const tool = normalizedTools?.find(tool => tool.name === functionCall.name)

  if (!tool) {
    const availableTools = normalizedTools?.map(tool => tool.name)
    const availableToolsErrorMsg = (availableTools == null || availableTools.length === 0)
      ? 'No tools are available'
      : `Available tools: ${availableTools.join(', ')}`
    throw new Error(`Model tried to call unavailable tool "${functionCall.name}", ${availableToolsErrorMsg}.`)
  }

  let parsedArgs: Record<string, unknown>

  try {
    parsedArgs = JSON.parse(functionCall.arguments) as Record<string, unknown>
  }
  catch (error) {
    throw new Error(`Failed to parse tool arguments as JSON for tool "${functionCall.name}". Arguments: ${functionCall.arguments}`, {
      cause: error,
    })
  }

  const toolResult = await tool.execute(parsedArgs, {
    abortSignal,
    toolCallId: functionCall.call_id,
  })

  return {
    call_id: functionCall.call_id,
    id: crypto.randomUUID(),
    output: normalizeToolOutput(toolResult),
    status: 'completed',
    type: 'function_call_output',
  }
}
