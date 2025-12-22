import type { CommonRequestOptions, WithUnknown } from '@xsai/shared'

import { requestBody, requestHeaders, requestURL, responseCatch, responseJSON } from '@xsai/shared'

export interface EmbedOptions extends CommonRequestOptions {
  /** The number of dimensions the resulting output embeddings should have. */
  dimensions?: number
  /** Input text to embed, encoded as a string of tokens. */
  input: string
}

export interface EmbedResponse {
  data: {
    embedding: number[]
    index: number
    object: 'embedding'
  }[]
  model: string
  object: 'list'
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

export const embed = async (options: WithUnknown<EmbedOptions>): Promise<EmbedResult> =>
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
      embedding: data[0].embedding,
      input: options.input,
      usage,
    }))
