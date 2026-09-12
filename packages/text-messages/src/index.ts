import type { HttpOptions } from '@xsai/shared'
import type { LanguageModel } from '@xsai/text-primitives'

import { EventSourceDataStream, EventSourceParserStream, requestURL, responseCatch } from '@xsai/text-primitives'

import { MessagesEventStream, normalizeInput, normalizeToolChoice, normalizeTools } from './utils'

export type * from './metadata'

const ANTHROPIC_VERSION = '2023-06-01'

export const messages = (options: HttpOptions): LanguageModel => async (context, modelOptions) => {
  const { messages: inputMessages, system } = normalizeInput(context)
  const maxTokens = modelOptions?.maxOutputTokens ?? options.extraBody?.max_tokens

  if (typeof maxTokens !== 'number')
    throw new Error('maxOutputTokens is required for the Messages API')

  return (options.fetch ?? fetch)(requestURL('messages', options.baseURL), {
    body: JSON.stringify({
      ...options.extraBody,
      ...modelOptions?.extraBody,
      max_tokens: maxTokens,
      messages: inputMessages,
      model: options.model,
      stream: true,
      ...(system === undefined ? {} : { system }),
      ...(modelOptions?.temperature === undefined ? {} : { temperature: modelOptions.temperature }),
      ...(modelOptions?.toolChoice === undefined ? {} : { tool_choice: normalizeToolChoice(modelOptions.toolChoice) }),
      ...(modelOptions?.topP === undefined ? {} : { top_p: modelOptions.topP }),
      tools: normalizeTools(context.tools),
    }),
    headers: {
      ...options.extraHeaders,
      'anthropic-version': ANTHROPIC_VERSION,
      'Content-Type': 'application/json',
      ...(options.apiKey === undefined ? {} : { 'x-api-key': options.apiKey }),
    },
    method: 'POST',
    signal: modelOptions?.signal,
  })
    .then(responseCatch)
    .then(res => res.body
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new EventSourceParserStream())
      .pipeThrough(new EventSourceDataStream())
      .pipeThrough(new MessagesEventStream()))
}
