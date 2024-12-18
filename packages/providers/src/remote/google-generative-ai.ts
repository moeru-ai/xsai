import type { ChatProvider, EmbeddingsProvider, ModelsProvider, ProviderOptions, ProviderResult } from '../types'

import { generateCRO } from '../utils/generate-cro'

export const createGoogleGenerativeAI = (userOptions: ProviderOptions<true>):
  /** @see {@link https://ai.google.dev/gemini-api/docs/models/gemini} */
  ChatProvider<'gemini-1.5-flash' | 'gemini-1.5-flash-8b' | 'gemini-1.5-pro' | 'gemini-2.0-flash-exp'>
  & EmbeddingsProvider<'text-embedding-004'>
  & ModelsProvider => {
  const options: ProviderResult = {
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
