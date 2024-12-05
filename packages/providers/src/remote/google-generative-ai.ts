import type { CommonRequestOptions } from '@xsai/shared'

import type { CommonProviderOptions } from '../types/common-provider-options'

import { generateCRO } from '../utils/generate-cro'

/** @see {@link https://ai.google.dev/gemini-api/docs/models/gemini#embedding} */
type GoogleGenerativeAIChatModel = 'gemini-1.5-flash' | 'gemini-1.5-flash-8b' | 'gemini-1.5-pro' | ({} & string)
type GoogleGenerativeAIEmbeddingsModel = 'text-embedding-004' | ({} & string)

export interface GoogleGenerativeAIProvider {
  chat: (model: GoogleGenerativeAIChatModel) => CommonRequestOptions
  embeddings: (model: GoogleGenerativeAIEmbeddingsModel) => CommonRequestOptions
}

export const createGoogleGenerativeAI = (userOptions: Omit<CommonProviderOptions, 'apiKey'> & Required<Pick<CommonProviderOptions, 'apiKey'>>): GoogleGenerativeAIProvider => {
  const options: CommonProviderOptions = {
    baseURL: new URL('https://generativelanguage.googleapis.com/v1beta/openai/'),
    ...userOptions,
  }

  return {
    chat: model => generateCRO(model, 'chat/completions', options),
    embeddings: model => generateCRO(model, 'embeddings', options),
  }
}
