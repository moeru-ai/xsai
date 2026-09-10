import type { Model, ModelOptions } from '@xsai/text-primitives'

import { EventSourceDataStream, EventSourceParserStream, requestHeaders, requestURL } from '@xsai/text-primitives'

import { normalizeInput, normalizeTools, ResponsesEventStream } from './utils'

export const responses = (modelOptions: ModelOptions): Model => ({
  metadata: {
    api: 'responses',
    baseURL: modelOptions.baseURL,
    model: modelOptions.model,
  },
  stream: async (textOptions) => {
    const res = await fetch(requestURL('responses', modelOptions.baseURL), {
      body: JSON.stringify({
        input: normalizeInput(textOptions.input),
        instructions: textOptions.instructions,
        model: modelOptions.model,
        stream: true,
        tools: normalizeTools(textOptions.tools),
      }),
      headers: requestHeaders(modelOptions.apiKey, modelOptions.extraHeaders),
      method: 'POST',
      signal: textOptions.signal,
    })

    return res.body!
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new EventSourceParserStream())
      .pipeThrough(new EventSourceDataStream())
      .pipeThrough(new ResponsesEventStream())
  },
  version: '1.0',
})
