import { createChatProvider, createEmbedProvider, createMetadata, defineProvider } from '@xsai-ext/shared-providers'

/** @see {@link https://developers.cloudflare.com/workers-ai} */
export const createWorkersAI = (apiKey: string, accountId: string) => {
  const baseURL = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/v1/`

  return defineProvider(
    createMetadata('workers-ai'),
    createChatProvider({ apiKey, baseURL }),
    createEmbedProvider({ apiKey, baseURL }),
  )
}
