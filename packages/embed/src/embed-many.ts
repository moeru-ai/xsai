import type { EmbeddingModel, EmbeddingModelOptions, EmbeddingModelResult } from './model'

export const embedMany = async (model: EmbeddingModel, options: Omit<EmbeddingModelOptions, 'input'> & { input: string[] }): Promise<EmbeddingModelResult> =>
  model(options)
