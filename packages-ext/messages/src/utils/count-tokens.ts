import type { CountTokensOptions } from '../types/messages-options'

import { clean, requestURL, responseCatch, responseJSON } from '@xsai/shared'

import { requestHeaders } from './request-headers'

export interface CountTokensResult {
  input_tokens: number
}

export const countTokens = async (options: CountTokensOptions): Promise<CountTokensResult> => {
  const { abortSignal, anthropicBeta, anthropicVersion, apiKey, baseURL = 'https://api.anthropic.com/v1/', fetch, headers, tools, ...body } = options

  return (fetch ?? globalThis.fetch)(requestURL('messages/count_tokens', baseURL), {
    body: JSON.stringify(clean({
      ...body,
      tools: tools?.map(({ execute, ...tool }) => tool),
    })),
    headers: requestHeaders(headers, apiKey, anthropicVersion, anthropicBeta),
    method: 'POST',
    signal: abortSignal,
  })
    .then(responseCatch)
    .then(responseJSON<CountTokensResult>)
}
