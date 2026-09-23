import type { HttpOptions } from '@xsai/shared'
import type { LanguageModel } from '@xsai/text-primitives'

import type { ResponsesProviderMessageMetadata } from './types/provider-metadata/message'
import type { ResponsesProviderPartMetadata } from './types/provider-metadata/part'
import type { ResponsesProviderOptions } from './types/provider-options'

import { wireRequest } from '@xsai/text-primitives/internal'

import { mergeTools, normalizeFormat, normalizeInput, normalizeToolChoice, ResponsesEventStream } from './utils'

export type * from './types/provider-metadata/message'
export type * from './types/provider-options'

declare module '@xsai/text-primitives' {
  interface ProviderMessageMetadata {
    responses?: ResponsesProviderMessageMetadata
  }

  interface ProviderOptions {
    responses?: ResponsesProviderOptions
  }

  interface ProviderPartMetadata {
    responses?: ResponsesProviderPartMetadata
  }
}

export const responses = (options: HttpOptions): LanguageModel => async modelOptions =>
  wireRequest(options, modelOptions, {
    body: {
      input: normalizeInput(modelOptions.input),
      instructions: modelOptions.instructions,
      max_output_tokens: modelOptions.maxOutputTokens,
      model: options.model,
      reasoning: modelOptions.reasoningEffort == null
        ? undefined
        : { effort: modelOptions.reasoningEffort },
      stream: true,
      temperature: modelOptions.temperature,
      text: normalizeFormat(modelOptions.outputFormat),
      tool_choice: normalizeToolChoice(modelOptions.toolChoice),
      tools: mergeTools(modelOptions.providerOptions?.responses?.tools, modelOptions.tools),
      top_p: modelOptions.topP,
    },
    path: 'responses',
  }, new ResponsesEventStream())
