import type { EmbeddingProviderOptions } from './model-embeddings'

export type EmbeddingModel = (options: EmbeddingModelOptions) => Promise<EmbeddingModelResult>

export interface EmbeddingModelOptions {
  input: string | string[]
  providerOptions?: EmbeddingProviderOptions
  signal?: AbortSignal
}

export interface EmbeddingModelResult {
  embeddings: number[][]
  usage: EmbeddingModelResultUsage
}

export interface EmbeddingModelResultUsage {
  promptTokens: number
  totalTokens: number
}
