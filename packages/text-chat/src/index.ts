import type { HttpOptions } from '@xsai/shared'
import type { LanguageModel } from '@xsai/text'

import type { ChatPartMetadata } from './metadata'
import type { ChatProviderOptions } from './provider-options'

import { wireRequest } from '@xsai/text/internal'

import { ChatEventStream, normalizeFormat, normalizeInput, normalizeToolChoice, normalizeTools } from './utils'

export type * from './metadata'
export type * from './provider-options'

declare module '@xsai/text' {
  interface LanguageModelProviderOptions {
    chat?: ChatProviderOptions
  }

  interface PartProviderMetadata {
    chat?: ChatPartMetadata
  }
}

export const chat = (options: HttpOptions): LanguageModel => async (modelOptions) => {
  const providerOptions = modelOptions.providerOptions?.chat
  return wireRequest({
    body: {
      frequency_penalty: providerOptions?.frequencyPenalty,
      max_tokens: modelOptions.maxOutputTokens,
      messages: normalizeInput(modelOptions),
      model: options.model,
      parallel_tool_calls: providerOptions?.parallelToolCalls,
      presence_penalty: providerOptions?.presencePenalty,
      reasoning_effort: modelOptions.reasoningEffort,
      response_format: normalizeFormat(modelOptions.outputFormat),
      seed: providerOptions?.seed,
      stop: providerOptions?.stopSequences,
      stream: true,
      stream_options: { include_usage: true },
      temperature: modelOptions.temperature,
      tool_choice: normalizeToolChoice(modelOptions.toolChoice),
      tools: normalizeTools(modelOptions.tools),
      top_k: providerOptions?.topK,
      top_p: modelOptions.topP,
    },
    path: 'chat/completions',
  }, options, modelOptions, new ChatEventStream(modelOptions.includeRawEvents))
}
