import type { CommonRequestOptions } from '@xsai/shared'

import type { ProviderResult } from '../types'

export const generateCRO = (model: string, { apiKey, baseURL, headers }: ProviderResult): CommonRequestOptions => ({
  apiKey,
  baseURL,
  headers,
  model,
})
