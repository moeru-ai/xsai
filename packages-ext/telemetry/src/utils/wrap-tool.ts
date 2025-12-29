import type { Tracer } from '@opentelemetry/api'
import type { Tool, ToolExecuteOptions } from 'xsai'

import { recordSpan } from './record-span'

export const wrapTool = (tool: Tool, tracer: Tracer): Tool => ({
  execute: async (input: unknown, options: ToolExecuteOptions) =>
    recordSpan({
      attributes: {
        'gen_ai.operation.name': 'execute_tool',
        'gen_ai.tool.call.arguments': JSON.stringify(input),
        'gen_ai.tool.call.description': tool.function.description,
        'gen_ai.tool.call.id': options.toolCallId,
        'gen_ai.tool.call.name': tool.function.name,
      },
      name: `execute_tool ${tool.function.name}`,
      tracer,
    }, async (span) => {
      try {
        const result = await tool.execute(input, options)
        span.setAttribute('gen_ai.tool.call.result', JSON.stringify(result))
        return result
      }
      catch (err) {
        if (err instanceof Error)
          span.setAttribute('error.type', err.message)

        throw err
      }
    }),
  function: tool.function,
  type: tool.type,
})
