import type { WithUnknown } from '@xsai/shared'

import type { EmbedOptions, EmbedResponse, EmbedResponseUsage } from './embed'

import { requestBody, requestHeaders, requestURL, responseCatch, responseJSON } from '@xsai/shared'

export interface EmbedManyOptions extends Omit<EmbedOptions, 'input'> {
  /** Input text to embed. */
  input: string[]
}

export interface EmbedManyResult {
  embeddings: number[][]
  input: string[]
  usage: EmbedResponseUsage
}

export const embedMany = async (options: WithUnknown<EmbedManyOptions>): Promise<EmbedManyResult> =>
  (options.fetch ?? globalThis.fetch)(requestURL('embeddings', options.baseURL), {
    body: requestBody(options),
    headers: requestHeaders({
      'Content-Type': 'application/json',
      ...options.headers,
    }, options.apiKey),
    method: 'POST',
    signal: options.abortSignal,
  })
    .then(responseCatch)
    .then(responseJSON<EmbedResponse>)
    .then(({ data, usage }) => ({
      embeddings: data.map(data => data.embedding),
      input: options.input,
      usage,
    }))
