import type { TelemetryOptions } from '@xsai/shared'

import type { Message, Tool, ToolCall, ToolMessagePart } from '../types'

import { instrumented } from '../../../shared/src/utils/telemetry'
import { wrapToolResult } from './internal/wrap-tool-result'

export interface ExecuteToolOptions extends TelemetryOptions {
  abortSignal?: AbortSignal
  messages: Message[]
  toolCall: ToolCall
  tools?: Tool[]
}

export interface ExecuteToolResult {
  parsedArgs: Record<string, unknown>
  result: string | ToolMessagePart[]
  toolName: string
}

export const executeTool = instrumented('xsai.executeTool', async ({ abortSignal, messages, toolCall, tools }: ExecuteToolOptions, span): Promise<ExecuteToolResult> => {
  const tool = tools?.find(tool => tool.function.name === toolCall.function.name)

  span?.setAttributes({
    'ai.toolCall.arguments': toolCall.function.arguments,
    'ai.toolCall.name': toolCall.function.name,
  })

  if (!tool) {
    const availableTools = tools?.map(tool => tool.function.name)
    const availableToolsErrorMsg = (availableTools == null || availableTools.length === 0)
      ? 'No tools are available.'
      : `Available tools: ${availableTools.join(', ')}.`
    throw new Error(`Model tried to call unavailable tool '${toolCall.function.name}. ${availableToolsErrorMsg}.`)
  }

  const parsedArgs = JSON.parse(toolCall.function.arguments) as Record<string, unknown>
  const result = wrapToolResult(await tool.execute(parsedArgs, {
    abortSignal,
    messages,
    toolCallId: toolCall.id,
  }))

  span?.setAttributes({
    'ai.toolCall.result': typeof result === 'string' ? result : JSON.stringify(result),
  })

  return { parsedArgs, result, toolName: toolCall.function.name }
})
