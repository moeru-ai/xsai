import type { Tool, ToolExecuteOptions } from "xsai";
import { recordSpan } from "./record-span";
import type { Tracer } from "@opentelemetry/api";

export const wrapTool = (tool: Tool, tracer: Tracer): Tool => ({
  function: tool.function,
  type: tool.type,
  execute: (input: unknown, options: ToolExecuteOptions) =>
    recordSpan({
    name: 'ai.toolCall',
    attributes: {
      'ai.operationId': 'ai.toolCall',
      'ai.toolCall.args': JSON.stringify(input),
      'ai.toolCall.id': options.toolCallId,
      'ai.toolCall.name': tool.function.name,
      'operation.name': 'ai.toolCall',
    },
    tracer,
  }, async span => {
    const result = await tool.execute(input, options)

    span.setAttribute('ai.toolCall.result', JSON.stringify(result))

    return result
  })
})
