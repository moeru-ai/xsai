import type { CommonContentPart, Tool, ToolCall, ToolExecuteResult } from '@xsai/shared-chat'

import type { FunctionCall, FunctionCallOutputItemParam, FunctionTool } from '../generated'

// eslint-disable-next-line sonarjs/function-return-type
export const toFunctionCallOutput = (result: ToolExecuteResult | undefined): FunctionCallOutputItemParam['output'] => {
  if (result === undefined)
    return ''

  if (typeof result === 'string')
    return result

  if (Array.isArray(result) && result.length > 0 && result.every(item => item !== null && typeof item === 'object' && 'type' in item && ['input_file', 'input_image', 'input_text'].includes((item as { type: string }).type)))
    return result as FunctionCallOutputItemParam['output']

  if (Array.isArray(result) && result.length > 0 && result.every(item => item !== null && typeof item === 'object' && 'type' in item && ['file', 'image_url', 'input_audio', 'text'].includes((item as { type: string }).type))) {
    return (result as CommonContentPart[]).map((item) => {
      if (item.type === 'text')
        return { text: item.text, type: 'input_text' }
      if (item.type === 'image_url')
        return { detail: item.image_url.detail, image_url: item.image_url.url, type: 'input_image' }
      if (item.type === 'file')
        return { ...item.file, type: 'input_file' }
      throw new Error('Responses function output does not support Chat audio content')
    })
  }

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
