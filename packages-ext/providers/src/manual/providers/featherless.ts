import {
  createChatProvider,
  createModelProvider,
  merge,
} from '../../utils'

/**
 * Create a Featherless AI Provider
 * @see {@link https://featherless.ai/models}
 */
export const createFeatherless = (apiKey: string, baseURL = 'https://api.featherless.ai/v1/') => merge(
  createChatProvider({ apiKey, baseURL }),
  createModelProvider({
    apiKey,
    baseURL,
    fetch: async (...args: Parameters<typeof globalThis.fetch>) => globalThis.fetch(...args)
      .then(async res => res.json() as Promise<unknown[]>)
      .then(data => Response.json({ data, object: 'list' })),
  }),
)
