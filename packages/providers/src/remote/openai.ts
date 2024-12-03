import type { CommonRequestOptions } from '@xsai/shared'

import type { CommonProviderOptions } from '../types/common-provider-options'

import { generateCRO } from '../utils/generate-cro'

/** @see {@link https://platform.openai.com/docs/models#model-endpoint-compatibility} */
type OpenAIChatModel = 'gpt-4o' | 'gpt-4o-mini' | 'o1-mini' | 'o1-preview' | ({} & string)
type OpenAIEmbeddingsModel = 'text-embedding-3-large' | 'text-embedding-3-small' | ({} & string)

export interface OpenAIProvider {
  chat: (model: OpenAIChatModel) => CommonRequestOptions
  embeddings: (model: OpenAIEmbeddingsModel) => CommonRequestOptions
}

export const createOpenAI = (userOptions: Omit<CommonProviderOptions, 'apiKey'> & Required<Pick<CommonProviderOptions, 'apiKey'>>): OpenAIProvider => {
  const options: CommonProviderOptions = {
    baseURL: new URL('https://openai.com/v1/'),
    ...userOptions,
  }

  return {
    chat: model => generateCRO(model, 'chat/completions', options),
    embeddings: model => generateCRO(model, 'embeddings', options),
  }
}
