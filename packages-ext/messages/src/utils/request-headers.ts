import { clean } from '@xsai/shared'

export const requestHeaders = (
  headers?: Record<string, string>,
  apiKey?: string,
  anthropicVersion = '2023-06-01',
  anthropicBeta?: string | string[],
) => clean({
  'anthropic-beta': Array.isArray(anthropicBeta)
    ? anthropicBeta.join(',')
    : anthropicBeta,
  'anthropic-version': anthropicVersion,
  'content-type': 'application/json',
  'x-api-key': apiKey,
  ...headers,
})
