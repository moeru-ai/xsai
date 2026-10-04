import type { EmbeddingModel, EmbeddingModelOptions, EmbeddingModelResultUsage } from './model'

export interface EmbedResult {
  embedding: number[]
  usage: EmbeddingModelResultUsage
}

export const embed = async (model: EmbeddingModel, options: Omit<EmbeddingModelOptions, 'input'> & { input: string }): Promise<EmbedResult> =>
  model(options)
    .then(({ embeddings, usage }) => ({
      embedding: embeddings[0],
      usage,
    }))
