import type { CommonRequestOptions } from '@xsai/shared'

import { requestBody, requestHeaders, requestURL, responseJSON } from '@xsai/shared'

export interface EmbedOptions extends CommonRequestOptions {
  [key: string]: unknown
  input: string
}

export interface EmbedResponse {
  data: {
    embedding: number[]
    index: number
    object: 'embedding'
  }[]
  model: string
  // eslint-disable-next-line sonarjs/no-useless-intersection
  object: 'list' | (string & {})
  system_fingerprint?: string
  usage: EmbedResponseUsage
}

export interface EmbedResponseUsage {
  prompt_tokens: number
  total_tokens: number
}

export interface EmbedResult {
  embedding: number[]
  input: string
  usage: EmbedResponseUsage
}

export const embed = async (options: EmbedOptions): Promise<EmbedResult> =>
  (options.fetch ?? globalThis.fetch)(requestURL('embeddings', options.baseURL), {
    body: requestBody(options),
    headers: requestHeaders({
      'Content-Type': 'application/json',
      ...options.headers,
    }, options.apiKey),
    method: 'POST',
    signal: options.abortSignal,
  })
    .then(responseJSON<EmbedResponse>)
    .then(({ data, usage }) => ({
      embedding: data[0].embedding,
      input: options.input,
      usage,
    }))
