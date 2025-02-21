import { createChatProvider, createModelProvider, merge } from '@xsai-ext/shared-providers'

/**
 * [Cerebras.ai](https://cerebras.ai/) provider.
 *
 * @see {@link https://inference-docs.cerebras.ai/api-reference/chat-completions}
 */
export const createCerebras = (apiKey: string, baseURL = 'https://api.cerebras.ai/v1/') => merge(
  createChatProvider<
    | 'llama3.1-8b'
    | 'llama-3.3-70b'
  >({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)
