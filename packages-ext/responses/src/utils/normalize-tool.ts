import type { Tool, ToolCall } from '@xsai/shared-chat'

import type { FunctionCall, FunctionCallOutput, FunctionTool } from '../generated'

export const wrapToolOutput = (output: FunctionCallOutput['output'] | object | unknown[]): string =>
  typeof output === 'string' ? output : JSON.stringify(output)

export const toFunctionTool = (tool: Tool): FunctionTool => ({
  description: tool.function.description ?? null,
  name: tool.function.name,
  parameters: tool.function.parameters,
  strict: tool.function.strict ?? null,
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
