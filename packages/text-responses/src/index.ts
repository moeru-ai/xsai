import type { HttpOptions } from '@xsai/shared'
import type { LanguageModel } from '@xsai/text'

import type { ResponsesPartMetadata } from './types/provider-metadata'
import type { ResponsesProviderOptions } from './types/provider-options'

import { requestURL } from '@xsai/shared'
import { wireRequest } from '@xsai/text/internal'

import { mergeTools, normalizeFormat, normalizeInput, normalizeToolChoice, ResponsesEventStream } from './utils'

export type * from './types/provider-metadata'
export type * from './types/provider-options'

declare module '@xsai/text' {
  interface LanguageModelProviderOptions {
    responses?: ResponsesProviderOptions
  }

  interface PartProviderMetadata {
    responses?: ResponsesPartMetadata
  }
}

export const responses = (options: HttpOptions): LanguageModel => async (modelOptions) => {
  const source = requestURL('responses', options.baseURL).toString()
  const providerOptions = modelOptions.providerOptions?.responses
  return wireRequest({
    body: {
      frequency_penalty: providerOptions?.frequencyPenalty,
      include: providerOptions?.include,
      input: normalizeInput(modelOptions.input, source),
      instructions: modelOptions.instructions,
      max_output_tokens: modelOptions.maxOutputTokens,
      model: options.model,
      parallel_tool_calls: providerOptions?.parallelToolCalls,
      presence_penalty: providerOptions?.presencePenalty,
      reasoning: modelOptions.reasoningEffort == null
        ? undefined
        : { effort: modelOptions.reasoningEffort },
      stream: true,
      temperature: modelOptions.temperature,
      text: normalizeFormat(modelOptions.outputFormat),
      tool_choice: normalizeToolChoice(modelOptions.toolChoice),
      tools: mergeTools(providerOptions?.tools, modelOptions.tools),
      top_p: modelOptions.topP,
    },
    path: source,
  }, options, modelOptions, new ResponsesEventStream(source, modelOptions.includeRawEvents))
}
