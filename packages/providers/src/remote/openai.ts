import type { ChatProvider, EmbeddingsProvider, ModelsProvider, ProviderOptions, ProviderResult } from '../types'

import { generateCRO } from '../utils/generate-cro'

export const createOpenAI = (userOptions: ProviderOptions<true>):
  /** @see {@link https://platform.openai.com/docs/models#model-endpoint-compatibility} */
  ChatProvider<'gpt-4o' | 'gpt-4o-mini' | 'o1-mini' | 'o1-preview'>
  & EmbeddingsProvider<'text-embedding-3-large' | 'text-embedding-3-small'>
  & ModelsProvider => {
  const options: ProviderResult = {
    ...userOptions,
    baseURL: userOptions.baseURL ?? new URL('https://openai.com/v1/'),
  }

  const result = (model: string) => generateCRO(model, options)

  return {
    chat: result,
    embeddings: result,
    models: () => options,
  }
}
