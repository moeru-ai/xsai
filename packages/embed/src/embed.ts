import type { EmbeddingModel, EmbeddingModelOptions, EmbeddingModelResultUsage } from './model'

import { XSAIError } from '@xsai/shared'

export interface EmbedResult {
  embedding: number[]
  usage?: EmbeddingModelResultUsage
}

export const embed = async (model: EmbeddingModel, options: Omit<EmbeddingModelOptions, 'input'> & { input: string }): Promise<EmbedResult> => {
  const { embeddings, usage } = await model(options)
  if (embeddings.length === 0)
    throw new XSAIError('invalid-response', 'Embedding model returned no embeddings')
  return { embedding: embeddings[0], usage }
}
