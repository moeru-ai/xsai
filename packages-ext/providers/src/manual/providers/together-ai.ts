import {
  createChatProvider,
  createEmbedProvider,
  createModelProvider,
  merge,
} from '@xsai-ext/shared-providers'

import type { TogetheraiModels } from '../../generated/types'

/**
 * Create a Together AI Provider
 * @see {@link https://docs.together.ai/docs/serverless-models}
 */
export const createTogetherAI = (apiKey: string, baseURL = 'https://api.together.xyz/v1/') => merge(
  createChatProvider<TogetheraiModels>({ apiKey, baseURL }),
  createEmbedProvider({ apiKey, baseURL }),
  createModelProvider({
    apiKey,
    baseURL,
    fetch: async (...args: Parameters<typeof globalThis.fetch>) => globalThis.fetch(...args)
      .then(async res => res.json() as Promise<unknown[]>)
      .then(data => Response.json({ data, object: 'list' })),
  }),
)
