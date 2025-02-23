import { createChatProvider, createMetadata, createModelProvider, defineProvider } from '@xsai-ext/shared-providers'

/** @see {@link https://docs.x.ai/docs/overview} */
export const createXAI = (apiKey: string, baseURL = 'https://api.x.ai/v1/') => defineProvider(
  createMetadata('xai'),
  /** @see {@link https://docs.x.ai/docs/models?cluster=us-east-1} */
  createChatProvider<'grok-2-1212' | 'grok-2-vision-1212'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)
