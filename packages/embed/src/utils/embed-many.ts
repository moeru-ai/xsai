import { clean, type CommonRequestOptions, requestUrl } from '@xsai/shared'

import type { EmbedModel, EmbedResponse, EmbedResponseUsage } from './embed'

export interface EmbedManyOptions extends CommonRequestOptions<'embeddings'> {
  [key: string]: unknown
  inputs: string[]
  model: EmbedModel
}

export interface EmbedManyResult {
  embeddings: number[][]
  inputs: string[]
  usage: EmbedResponseUsage
}

export const embedMany = async (options: EmbedManyOptions): Promise<EmbedManyResult> => {
  const { data, usage } = await fetch(requestUrl(options.path ?? 'embeddings', options.base), {
    body: JSON.stringify(clean({
      ...options,
      abortSignal: undefined,
      base: undefined,
      headers: undefined,
      input: options.inputs,
      inputs: undefined,
      path: undefined,
    })),
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    method: 'POST',
    signal: options.abortSingal,
  }).then(res => res.json() as Promise<EmbedResponse>)

  return {
    embeddings: data.map(data => data.embedding),
    inputs: options.inputs,
    usage,
  }
}
