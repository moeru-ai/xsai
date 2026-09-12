import type { HttpOptions } from '@xsai/shared'
import type { LanguageModel } from '@xsai/text-primitives'

import { EventSourceDataStream, EventSourceParserStream, requestHeaders, requestURL, responseCatch } from '@xsai/text-primitives'

import { ChatEventStream, normalizeInput, normalizeToolChoice, normalizeTools } from './utils'

export type * from './metadata'

export const chat = (options: HttpOptions): LanguageModel => async (context, modelOptions) =>
  (options.fetch ?? fetch)(requestURL('chat/completions', options.baseURL), {
    body: JSON.stringify({
      ...options.extraBody,
      ...modelOptions?.extraBody,
      ...(modelOptions?.maxOutputTokens === undefined ? {} : { max_tokens: modelOptions.maxOutputTokens }),
      messages: normalizeInput(context),
      model: options.model,
      ...(modelOptions?.reasoningEffort === undefined ? {} : { reasoning_effort: modelOptions.reasoningEffort }),
      stream: true,
      stream_options: {
        include_usage: true,
        ...options.extraBody?.stream_options as Record<string, unknown>,
        ...modelOptions?.extraBody?.stream_options as Record<string, unknown>,
      },
      ...(modelOptions?.temperature === undefined ? {} : { temperature: modelOptions.temperature }),
      ...(modelOptions?.toolChoice === undefined
        ? {}
        : {
            tool_choice: normalizeToolChoice(modelOptions.toolChoice, {
              ...options.extraBody?.tool_choice as Record<string, unknown>,
              ...modelOptions.extraBody?.tool_choice as Record<string, unknown>,
            }),
          }),
      ...(modelOptions?.topP === undefined ? {} : { top_p: modelOptions.topP }),
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
