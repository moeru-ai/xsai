import type { CommonRequestOptions } from '@xsai/shared'

import type { CommonProviderOptions } from '../types/common-provider-options'

export const generateCRO = (model: string, path: string, { apiKey, baseURL, headers }: CommonProviderOptions): CommonRequestOptions => ({
  apiKey,
  headers,
  model,
  url: new URL(path, baseURL),
})
