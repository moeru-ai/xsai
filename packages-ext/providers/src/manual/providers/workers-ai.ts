import { createChatProvider, createEmbedProvider, merge } from '@xsai-ext/shared-providers'

import type { CloudflareWorkersAiModels } from '../../generated/types'

/**
 * Create a Workers AI Provider
 * @see {@link https://developers.cloudflare.com/workers-ai}
 */
export const createWorkersAI = (apiKey: string, accountId: string) => {
  const baseURL = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/v1/`

  return merge(
    createChatProvider<CloudflareWorkersAiModels>({ apiKey, baseURL }),
    createEmbedProvider({ apiKey, baseURL }),
  )
}
