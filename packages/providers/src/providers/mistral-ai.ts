import type { ChatProvider, EmbedProvider, ModelProvider, ProviderOptions, ProviderResult } from '../types'

import { generateCRO } from '../utils/generate-cro'

/**
 * [Mistral AI](https://mistral.ai/) provider
 *
 * Mistral AI is a research lab building the best open source models in the world. La
 * Plateforme enables developers and enterprises to build new products and applications,
 * powered by Mistral's open source and commercial LLMs.
 *
 * @see {@link https://docs.mistral.ai/}
 *
 */
export const createMistralAI = (userOptions: ProviderOptions<true>):
  /** @see {@link https://docs.mistral.ai/getting-started/models/models_overview/} */
  ChatProvider<
    | 'codestral-latest'
    | 'codestral-mamba-latest'
    | 'ministral-3b-latest'
    | 'ministral-8b-latest'
    | 'mistral-large-latest'
    | 'mistral-moderation-latest'
    | 'mistral-small-latest'
    | 'mistral-tiny-latest'
  >
  & EmbedProvider<
  | 'mistral-embed'
  >
  & ModelProvider => {
  const options: ProviderResult = {
    ...userOptions,
    baseURL: userOptions.baseURL ?? new URL('https://api.mistral.ai/v1/'),
  }

  const result = (model: string) => generateCRO(model, options)

  return {
    chat: result,
    embed: result,
    model: () => options,
  }
}
