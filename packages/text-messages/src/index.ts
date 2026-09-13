import type { HttpOptions } from '@xsai/shared'
import type { LanguageModel } from '@xsai/text-primitives'

import { wireRequest } from '@xsai/text-primitives'

import { messagesEventStream, normalizeInput, normalizeToolChoice, normalizeTools } from './utils'

export type * from './metadata'

const ANTHROPIC_VERSION = '2023-06-01'

export const messages = (options: HttpOptions): LanguageModel => async (context, modelOptions) => {
  const { messages: inputMessages, system } = normalizeInput(context)
  const maxTokens = modelOptions?.maxOutputTokens ?? modelOptions?.extraBody?.max_tokens

  if (typeof maxTokens !== 'number')
    throw new Error('maxOutputTokens is required for the Messages API')

  return wireRequest(options, modelOptions, {
    body: {
      effort: modelOptions?.reasoningEffort,
      max_tokens: maxTokens,
      messages: inputMessages,
      model: options.model,
      stream: true,
      system,
      temperature: modelOptions?.temperature,
      tool_choice: normalizeToolChoice(modelOptions?.toolChoice, modelOptions?.extraBody?.tool_choice as Record<string, unknown>),
      tools: normalizeTools(context.tools),
      top_p: modelOptions?.topP,
    },
    headers: {
      ...options.extraHeaders,
      'anthropic-version': ANTHROPIC_VERSION,
      'Content-Type': 'application/json',
      'x-api-key': options.apiKey,
    },
    path: 'messages',
  }, messagesEventStream())
}
