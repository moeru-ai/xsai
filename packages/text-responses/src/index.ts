import type { HttpOptions } from '@xsai/shared'
import type { LanguageModel } from '@xsai/text-primitives'

import { EventSourceDataStream, EventSourceParserStream, requestHeaders, requestURL, responseCatch } from '@xsai/text-primitives'

import { normalizeInput, normalizeToolChoice, normalizeTools, ResponsesEventStream } from './utils'

export const responses = (options: HttpOptions): LanguageModel => async (context, modelOptions) =>
  (options.fetch ?? fetch)(requestURL('responses', options.baseURL), {
    body: JSON.stringify({
      ...options.extraBody,
      ...modelOptions?.extraBody,
      input: normalizeInput(context.input),
      instructions: context.instructions,
      ...(modelOptions?.maxOutputTokens === undefined ? {} : { max_output_tokens: modelOptions.maxOutputTokens }),
      model: options.model,
      ...(modelOptions?.reasoningEffort === undefined
        ? {}
        : {
            reasoning: {
              ...options.extraBody?.reasoning as Record<string, unknown>,
              ...modelOptions.extraBody?.reasoning as Record<string, unknown>,
              effort: modelOptions.reasoningEffort,
            },
          }),
      stream: true,
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
      .pipeThrough(new EventSourceDataStream())
      .pipeThrough(new ResponsesEventStream()))
