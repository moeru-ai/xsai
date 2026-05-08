import type { Tool, ToolCall, ToolExecuteResult } from '@xsai/shared-chat'

import type { FunctionCall, FunctionCallOutput, FunctionTool } from '../generated'

// eslint-disable-next-line sonarjs/function-return-type
export const toFunctionCallOutput = (result: ToolExecuteResult): FunctionCallOutput['output'] => {
  if (typeof result === 'string')
    return result

  if (Array.isArray(result) && result.every(item => item !== null && typeof item === 'object' && 'type' in item && ['input_file', 'input_image', 'input_text'].includes((item as { type: string }).type)))
    return result as FunctionCallOutput['output']

  return JSON.stringify(result)
}

export const toFunctionTool = (tool: Tool): FunctionTool => ({
  description: tool.function.description ?? null,
  name: tool.function.name,
  parameters: tool.function.parameters,
  strict: tool.function.strict ?? true,
  type: 'function',
})

export const toToolCall = (functionCall: FunctionCall): ToolCall => ({
  function: {
    arguments: functionCall.arguments,
    name: functionCall.name,
  },
  id: functionCall.call_id,
  type: 'function',
})
