import type { Tracer } from '@opentelemetry/api'
import type { Tool, ToolExecuteOptions } from 'xsai'

import { recordSpan } from './record-span'

export const wrapTool = (tool: Tool, tracer: Tracer): Tool => ({
  execute: async (input: unknown, options: ToolExecuteOptions) =>
    recordSpan({
      attributes: {
        'ai.operationId': 'ai.toolCall',
        'ai.toolCall.args': JSON.stringify(input),
        'ai.toolCall.id': options.toolCallId,
        'ai.toolCall.name': tool.function.name,
        'operation.name': 'ai.toolCall',
      },
      name: 'ai.toolCall',
      tracer,
    }, async (span) => {
      const result = await tool.execute(input, options)

      span.setAttribute('ai.toolCall.result', JSON.stringify(result))

      return result
    }),
  function: tool.function,
  type: tool.type,
})
