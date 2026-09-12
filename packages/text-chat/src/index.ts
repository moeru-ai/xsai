import type { HttpOptions } from '@xsai/shared'
import type { LanguageModel } from '@xsai/text-primitives'

import { EventSourceDataStream, EventSourceParserStream, requestHeaders, requestURL, responseCatch } from '@xsai/text-primitives'

import { ChatEventStream, normalizeInput, normalizeTools } from './utils'

export const chat = (options: HttpOptions): LanguageModel => async (context, modelOptions) =>
  (options.fetch ?? fetch)(requestURL('chat/completions', options.baseURL), {
    body: JSON.stringify({
      ...options.extraBody,
      ...modelOptions?.extraBody,
      ...(modelOptions?.maxTokens === undefined ? {} : { max_tokens: modelOptions.maxTokens }),
      messages: normalizeInput(context),
      model: options.model,
      stream: true,
      stream_options: {
        include_usage: true,
        ...(options.extraBody?.stream_options as Record<string, unknown> | undefined),
      },
      tools: normalizeTools(context.tools),
    }),
    headers: requestHeaders(options.apiKey, options.extraHeaders),
    method: 'POST',
    signal: modelOptions?.signal,
  })
    .then(responseCatch)
    .then(res => res.body
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new EventSourceParserStream())
      .pipeThrough(new EventSourceDataStream(true))
      .pipeThrough(new ChatEventStream()))
