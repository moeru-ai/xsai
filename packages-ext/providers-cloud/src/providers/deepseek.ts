import { createChatProvider, createModelProvider, merge } from '@xsai-ext/shared-providers'

/** @see {@link https://api-docs.deepseek.com/quick_start/pricing} */
export const createDeepSeek = (apiKey: string, baseURL = 'https://api.deepseek.com/') => merge(
  createChatProvider<'deepseek-chat' | 'deepseek-reasoner'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)
