import type { HttpOptions } from '@xsai/shared'
import type { LanguageModel } from '@xsai/text-primitives'

import { XSAIError } from '@xsai/shared'
import { wireRequest } from '@xsai/text-primitives'

import { MessagesEventStream, normalizeFormat, normalizeInput, normalizeToolChoice, normalizeTools } from './utils'

export type * from './metadata'

const ANTHROPIC_VERSION = '2023-06-01'

export const messages = (options: HttpOptions): LanguageModel => async (modelOptions) => {
  const { messages: inputMessages, system } = normalizeInput(modelOptions)
  const maxTokens = modelOptions.maxOutputTokens ?? modelOptions.extraBody?.max_tokens
  const format = normalizeFormat(modelOptions.format)

  if (typeof maxTokens !== 'number')
    throw new XSAIError('invalid-input', 'maxOutputTokens is required for the Messages API')

  return wireRequest(options, modelOptions, {
    body: {
      max_tokens: maxTokens,
      messages: inputMessages,
      model: options.model,
      output_config: modelOptions.reasoningEffort == null && format == null
        ? undefined
        : { effort: modelOptions.reasoningEffort, format },
      stream: true,
      system,
      temperature: modelOptions.temperature,
      tool_choice: normalizeToolChoice(modelOptions.toolChoice),
      tools: normalizeTools(modelOptions.tools),
      top_p: modelOptions.topP,
    },
    headers: {
      ...options.extraHeaders,
      'anthropic-version': ANTHROPIC_VERSION,
      'Content-Type': 'application/json',
      ...(options.apiKey == null ? {} : { 'x-api-key': options.apiKey }),
    },
    path: 'messages',
  }, new MessagesEventStream())
}
