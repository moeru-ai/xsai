import { clean, type CommonRequestOptions, requestUrl } from '@xsai/shared'

import type { EmbedModel, EmbedResponse, EmbedResponseUsage } from './embed'

export interface EmbedManyOptions extends CommonRequestOptions<'embeddings'> {
  [key: string]: unknown
  input: string[]
  model: EmbedModel
}

export interface EmbedManyResult {
  embeddings: number[][]
  input: string[]
  usage: EmbedResponseUsage
}

export const embedMany = async (options: EmbedManyOptions): Promise<EmbedManyResult> =>
  await fetch(requestUrl(options.path ?? 'embeddings', options.base), {
    body: JSON.stringify(clean({
      ...options,
      abortSignal: undefined,
      base: undefined,
      headers: undefined,
      path: undefined,
    })),
    headers: {
      'Content-Type': 'application/json',
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
