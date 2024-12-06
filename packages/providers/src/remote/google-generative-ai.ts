import type { CommonRequestOptions } from '@xsai/shared'

import type { CommonProviderOptions } from '../types/common-provider-options'

import { generateCRO } from '../utils/generate-cro'

/** @see {@link https://ai.google.dev/gemini-api/docs/models/gemini#embedding} */
type GoogleGenerativeAIChatModel = 'gemini-1.5-flash' | 'gemini-1.5-flash-8b' | 'gemini-1.5-pro' | ({} & string)
type GoogleGenerativeAIEmbeddingsModel = 'text-embedding-004' | ({} & string)

export interface GoogleGenerativeAIProvider {
  chat: (model: GoogleGenerativeAIChatModel) => CommonRequestOptions
  embeddings: (model: GoogleGenerativeAIEmbeddingsModel) => CommonRequestOptions
  models: () => CommonProviderOptions
}

export const createGoogleGenerativeAI = (userOptions: Partial<Omit<CommonProviderOptions, 'apiKey'>> & Required<Pick<CommonProviderOptions, 'apiKey'>>): GoogleGenerativeAIProvider => {
  const options: CommonProviderOptions = {
    ...userOptions,
    baseURL: userOptions.baseURL ?? new URL('https://generativelanguage.googleapis.com/v1beta/openai/'),
  }

  const result = (model: string) => generateCRO(model, options)

  return {
    chat: result,
    embeddings: result,
    models: () => options,
  }
}
