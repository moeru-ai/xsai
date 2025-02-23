import { createChatProvider, createMetadata, defineProvider } from '@xsai-ext/shared-providers'

/** @see {@link https://docs.perplexity.ai/guides/getting-started} */
export const createPerplexity = (apiKey: string, baseURL = 'https://api.perplexity.ai/') => defineProvider(
  createMetadata('perplexity'),
  /** @see {@link https://docs.perplexity.ai/api-reference/chat-completions} */
  createChatProvider<'sonar' | 'sonar-pro' | 'sonar-reasoning' | 'sonar-reasoning-pro'>({ apiKey, baseURL }),
)
