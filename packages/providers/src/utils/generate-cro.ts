import type { CommonRequestOptions } from '@xsai/shared'

import type { CommonProviderOptions } from '../types/common-provider-options'

export const generateCRO = (model: string, { apiKey, baseURL, headers }: CommonProviderOptions): CommonRequestOptions => ({
  apiKey,
  baseURL,
  headers,
  model,
})
