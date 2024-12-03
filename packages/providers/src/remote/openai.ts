import type { CommonProviderOptions } from '../types/common-provider-options'
import type { ProviderResult } from '../types/provider-result'

import { generateProviderResult } from '../utils/generate-provider-result'

/** @see {@link https://platform.openai.com/docs/models#model-endpoint-compatibility} */
type OpenAIChatModel = 'gpt-4o' | 'gpt-4o-mini' | 'o1-mini' | 'o1-preview' | ({} & string)
type OpenAIEmbeddingsModel = 'text-embedding-3-large' | 'text-embedding-3-small' | ({} & string)

export interface OpenAIProvider {
  chat: (model: OpenAIChatModel) => ProviderResult
  embeddings: (model: OpenAIEmbeddingsModel) => ProviderResult
}

export const createOpenAI = (userOptions: Omit<CommonProviderOptions, 'apiKey'> & Required<Pick<CommonProviderOptions, 'apiKey'>>): OpenAIProvider => {
  const options: CommonProviderOptions = {
    baseURL: new URL('https://openai.com/v1/'),
    ...userOptions,
  }

  return {
    chat: model => generateProviderResult(model, 'chat/completions', options),
    embeddings: model => generateProviderResult(model, 'embeddings', options),
  }
}
