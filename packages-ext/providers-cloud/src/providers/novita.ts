import { createChatProvider, createMetadataProvider, createModelProvider, defineProvider } from '@xsai-ext/shared-providers'

/** @see {@link https://novita.ai/pricing} */
export const createNovita = (apiKey: string, baseURL = 'https://api.novita.ai/v3/openai/') => defineProvider(
  createMetadataProvider('novita'),
  createChatProvider<
    | 'deepseek/deepseek-r1'
    | 'deepseek/deepseek_v3'
    | 'meta-llama/llama-3.3-70b-instruct'
  >({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)
