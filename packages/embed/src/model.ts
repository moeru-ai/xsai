import type { Promisable } from '@xsai/shared'

export type EmbeddingModel = (options: EmbeddingModelOptions) => Promisable<EmbeddingModelResult>

export interface EmbeddingModelOptions {
  input: string | string[]
  providerOptions?: EmbeddingModelProviderOptions
  signal?: AbortSignal
}

export interface EmbeddingModelProviderOptions {}

export interface EmbeddingModelResult {
  embeddings: number[][]
  usage?: EmbeddingModelResultUsage
}

export interface EmbeddingModelResultUsage {
  inputTokens: number
  totalTokens: number
}
