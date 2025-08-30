import type { GenerateTextOptions, GenerateTextResult } from 'xsai'

import { generateText as originalGenerateText } from 'xsai'

import { getTracer } from './get-tracer'
import { recordSpan } from './record-span'

export const generateText = async (options: GenerateTextOptions) => {
  const tracer = getTracer()

  return recordSpan<GenerateTextResult>({
    attributes: {
      'ai.model.id': options.model,
      // TODO: provider name
      'ai.model.provider': 'xsai',
      'ai.operationId': 'ai.generateText',
      'ai.prompt': JSON.stringify({ messages: options.messages }),
      'operation.name': 'ai.generateText',
    },
    name: 'ai.generateText',
    tracer,
  }, async (span) => {
    // TODO: ai.generateText.doGenerate
    const result = await originalGenerateText(options)

    span.setAttributes({
      'ai.response.finishReason': result.finishReason,
      // TODO: ai.response.toolCalls
      'ai.response.text': result.text,
      'ai.usage.completionTokens': result.usage.completion_tokens,
      'ai.usage.promptTokens': result.usage.prompt_tokens,
    })

    return result
  })
}
