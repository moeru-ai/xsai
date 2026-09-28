import type { HttpOptions, Promisable } from '@xsai/shared'

import { postJSON } from '@xsai/shared'

export type EmbeddingModel = <T extends EmbedInput>(options: EmbedOptions<T>) => Promisable<EmbedResult<T>>

export type EmbedInput = readonly string[] | string

export interface EmbedOptions<T extends EmbedInput> extends HttpOptions {
  dimensions?: number
  input: T
  signal?: AbortSignal
}

export type EmbedResult<T extends EmbedInput> = (
  T extends string
    ? { embedding: number[] }
    : { embeddings: number[][] }
) & {
  usage: EmbedResultUsage
}

export interface EmbedResultUsage {
  promptTokens: number
  totalTokens: number
}

export const embed = (async (options: EmbedOptions<EmbedInput>): Promise<EmbedResult<EmbedInput>> => {
  const response = await postJSON(options, {
    body: { dimensions: options.dimensions, input: options.input, model: options.model },
    path: 'embeddings',
    signal: options.signal,
  })
  const payload = await response.json() as {
    data: { embedding: number[], index: number }[]
    usage: { prompt_tokens: number, total_tokens: number }
  }
  const usage: EmbedResultUsage = {
    promptTokens: payload.usage.prompt_tokens,
    totalTokens: payload.usage.total_tokens,
  }

  const embeddings = payload.data
    .toSorted((a, b) => a.index - b.index)
    .map(item => item.embedding)

  return (typeof options.input === 'string'
    ? { embedding: embeddings[0], usage }
    : { embeddings, usage })
}) as EmbeddingModel
