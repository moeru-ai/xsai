import type { CloudflareWorkersAiModels } from '../../generated/types'

import { createChatProvider, createEmbedProvider, merge } from '../../utils'

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
