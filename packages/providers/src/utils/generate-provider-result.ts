import type { CommonProviderOptions } from '../types/common-provider-options'
import type { ProviderResult } from '../types/provider-result'

export const generateProviderResult = (model: string, path: string, { apiKey, baseURL, headers }: CommonProviderOptions): ProviderResult => ({
  headers: {
    ...headers,
    ...(apiKey
      ? {
          Authorization: `Bearer ${apiKey}`,
        }
      : {}),
  },
  model,
  url: new URL(path, baseURL),
})
