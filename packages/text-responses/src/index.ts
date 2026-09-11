import type { HttpOptions } from '@xsai/shared'
import type { LanguageModel } from '@xsai/text-primitives'

import { EventSourceDataStream, EventSourceParserStream, requestHeaders, requestURL } from '@xsai/text-primitives'

import { normalizeInput, normalizeTools, ResponsesEventStream } from './utils'

export const responses = (options: HttpOptions): LanguageModel => async context =>
  (options.fetch ?? fetch)(requestURL('responses', options.baseURL), {
    body: JSON.stringify({
      ...options.extraBody,
      input: normalizeInput(context.input),
      instructions: context.instructions,
      model: options.model,
      stream: true,
      tools: normalizeTools(context.tools),
    }),
    headers: requestHeaders(options.apiKey, options.extraHeaders),
    method: 'POST',
    signal: context.signal,
  })
  // TODO: catch
    .then(res => res.body!
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new EventSourceParserStream())
      .pipeThrough(new EventSourceDataStream())
      .pipeThrough(new ResponsesEventStream()))
