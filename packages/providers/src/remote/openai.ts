import type { CommonRequestOptions } from '@xsai/shared'

import type { CommonProviderOptions } from '../types/common-provider-options'

import { generateCRO } from '../utils/generate-cro'

/** @see {@link https://platform.openai.com/docs/models#model-endpoint-compatibility} */
type OpenAIChatModel = 'gpt-4o' | 'gpt-4o-mini' | 'o1-mini' | 'o1-preview' | ({} & string)
type OpenAIEmbeddingsModel = 'text-embedding-3-large' | 'text-embedding-3-small' | ({} & string)

export interface OpenAIProvider {
  chat: (model: OpenAIChatModel) => CommonRequestOptions
  embeddings: (model: OpenAIEmbeddingsModel) => CommonRequestOptions
  models: () => CommonProviderOptions
}

export const createOpenAI = (userOptions: Omit<CommonProviderOptions, 'apiKey'> & Required<Pick<CommonProviderOptions, 'apiKey'>>): OpenAIProvider => {
  const options: CommonProviderOptions = {
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
