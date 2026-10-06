import type { RetrieveModel, RetrieveModelOptions } from './model'

export const listModels = async (model: RetrieveModel, options: RetrieveModelOptions = {}) =>
  model.list(options)
