import type { FunctionCall, FunctionCallOutput } from '../generated'
import type { ExecutableTool } from './tool'

export interface ExecuteToolOptions {
  // abortSignal?: AbortSignal
  functionCall: FunctionCall
  tools?: ExecutableTool[]
}

export const executeTool = async ({ functionCall, tools }: ExecuteToolOptions): Promise<FunctionCallOutput> => {
  const tool = tools?.find(tool => tool.name === functionCall.name)

  if (!tool) {
    const availableTools = tools?.map(tool => tool.name)
    const availableToolsErrorMsg = (availableTools == null || availableTools.length === 0)
      ? 'No tools are available'
      : `Available tools: ${availableTools.join(', ')}`
    throw new Error(`Model tried to call unavailable tool "${functionCall.name}", ${availableToolsErrorMsg}.`)
  }

  const parsedArgs = JSON.parse(functionCall.arguments) as Record<string, unknown>
  const toolResult = await tool.execute(parsedArgs)

  return {
    call_id: functionCall.call_id,
    id: crypto.randomUUID(),
    output: toolResult,
    status: 'completed',
    type: 'function_call_output',
  }
}
