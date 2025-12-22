import type { Tracer } from '@opentelemetry/api'
import type { ExecuteToolOptions } from 'xsai'

import { executeTool as originalExecuteTool } from 'xsai'
import { recordSpan } from './record-span'

export const executeTool = async (options: ExecuteToolOptions, tracer: Tracer) =>
  recordSpan({
    attributes: {
      'gen_ai.operation.name': 'execute_tool',
      'gen_ai.tool.call.type': 'function',
    },
    name: 'xsai.executeTool',
    tracer
  }, async (span) => {
    const result = await originalExecuteTool(options)
    const tool = options.tools!.find(t => t.function.name === result.completionToolCall.toolName)!

    span.setAttributes({
      'gen_ai.tool.call.arguments': result.completionToolCall.args,
      'gen_ai.tool.call.name': tool.function.name,
      'gen_ai.tool.call.description': tool.function.description,
      'gen_ai.tool.call.result': JSON.stringify(result.completionToolResult.result),
      'gen_ai.tool.call.id': result.completionToolCall.toolCallId,
      'gen_ai.tool.definitions': JSON.stringify(options.tools?.map(tool => ({ function: tool.function, type: tool.type })))
    })

    return result
  })

