import { type CommonRequestOptions, requestBody } from '@xsai/shared'

import type { EmbedResponse, EmbedResponseUsage } from './embed'

export interface EmbedManyOptions extends CommonRequestOptions {
  [key: string]: unknown
  input: string[]
}

export interface EmbedManyResult {
  embeddings: number[][]
  input: string[]
  usage: EmbedResponseUsage
}

export const embedMany = async (options: EmbedManyOptions): Promise<EmbedManyResult> =>
  await fetch(options.url, {
    body: requestBody(options),
    headers: {
      'Content-Type': 'application/json',
      ...(options.apiKey
        ? {
            Authorization: `Bearer ${options.apiKey}`,
          }
        : {}),
      ...options.headers,
    },
    method: 'POST',
    signal: options.abortSignal,
  })
    .then(res => res.json() as Promise<EmbedResponse>)
    .then(({ data, usage }) => ({
      embeddings: data.map(data => data.embedding),
      input: options.input,
      usage,
    }))
