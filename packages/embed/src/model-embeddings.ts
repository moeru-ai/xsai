import type { HttpOptions } from '@xsai/shared'

import type { EmbeddingModel } from './model'

import { postJSON } from '@xsai/shared'

declare module '@xsai/embed' {
  interface EmbeddingModelProviderOptions {
    embeddings?: {
      dimensions?: number
    }
  }
}

export const embeddings = (options: HttpOptions): EmbeddingModel => async modelOptions =>
  postJSON(options, {
    body: {
      dimensions: modelOptions.providerOptions?.embeddings?.dimensions,
      input: modelOptions.input,
      model: options.model,
    },
    path: 'embeddings',
    signal: modelOptions.signal,
  })
    .then(async res => res.json() as Promise<{
      data: { embedding: number[], index: number }[]
      usage?: { prompt_tokens: number, total_tokens: number }
    }>)
    .then(json => ({
      embeddings: json.data
        .toSorted((a, b) => a.index - b.index)
        .map(item => item.embedding),
      usage: json.usage == null
        ? undefined
        : {
            inputTokens: json.usage.prompt_tokens,
            totalTokens: json.usage.total_tokens,
          },
    }))
