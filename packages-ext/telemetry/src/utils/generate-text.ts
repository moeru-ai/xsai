import type { GenerateTextOptions, GenerateTextResult } from 'xsai'

import { generateText as originalGenerateText } from 'xsai'

import { getTracer } from './get-tracer'
import { recordSpan } from './record-span'
import { stringifyTool } from './stringify-tool'
import { wrapTool } from './wrap-tool'

export const generateText = async (options: GenerateTextOptions) => {
  const tracer = getTracer()

  const commonAttributes = (operationId: string) => ({
    'ai.model.id': options.model,
    // TODO: provider name
    'ai.model.provider': 'xsai',
    'ai.operationId': operationId,
    'ai.response.providerMetadata': '{}',
    'operation.name': operationId,
  })

  const idAttributes = () => {
    const id = crypto.randomUUID()

    return {
      'ai.response.id': id,
      'ai.response.timestamp': new Date().toISOString(),
      'gen_ai.response.id': id,
    }
  }

  return recordSpan<GenerateTextResult>({
    attributes: {
      ...commonAttributes('ai.generateText'),
      'ai.prompt': JSON.stringify({ messages: options.messages }),
    },
    name: 'ai.generateText',
    tracer,
  }, async (span) => {
    const result = await originalGenerateText({
      ...options,
      tools: options.tools?.map(tool => wrapTool(tool, tracer)),
      onStepFinish: async step => recordSpan({
        attributes: {
          ...commonAttributes('ai.generateText.doGenerate'),
          ...idAttributes(),
          ...(options.tools != null && options.tools.length > 0
            ? {
                'ai.prompt.toolChoice': JSON.stringify(options.toolChoice ?? { type: 'auto' }),
                'ai.prompt.tools': options.tools.map(stringifyTool),
              }
            : {}),
          ...((step.text != null && step.toolCalls.length === 0) ? { 'ai.response.text': step.text } : {}),
          ...(step.toolCalls.length > 0 ? { 'ai.response.toolCalls': JSON.stringify(step.toolCalls) } : {}),
          // TODO: step messages
          'ai.prompt.messages': JSON.stringify(options.messages),
          'ai.response.finishReason': step.finishReason,
          'ai.response.model': options.model,
          'ai.usage.completionTokens': step.usage.completion_tokens,
          'ai.usage.promptTokens': step.usage.prompt_tokens,
          'gen_ai.request.model': options.model,
          'gen_ai.response.finish_reasons': [step.finishReason],
          'gen_ai.response.id': crypto.randomUUID(),
          'gen_ai.response.model': options.model,
          'gen_ai.system': 'xsai',
          'gen_ai.usage.input_tokens': step.usage.prompt_tokens,
          'gen_ai.usage.output_tokens': step.usage.completion_tokens,
        },
        name: 'ai.generateText.doGenerate',
        tracer,
      }, async () => options.onStepFinish?.(step)),
    })

    span.setAttributes({
      ...(result.toolCalls.length > 0 ? { 'ai.response.toolCalls': JSON.stringify(result.toolCalls) } : {}),
      ...(result.text != null ? { 'ai.response.text': result.text } : {}),
      'ai.response.finishReason': result.finishReason,
      'ai.usage.completionTokens': result.usage.completion_tokens,
      'ai.usage.promptTokens': result.usage.prompt_tokens,
    })

    return result
  })
}
