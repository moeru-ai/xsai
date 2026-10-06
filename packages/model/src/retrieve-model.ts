import type { RetrieveModel, RetrieveModelOptions } from './model'

export const retrieveModel = async (model: RetrieveModel, options: RetrieveModelOptions & { model: string }) =>
  model.retrieve(options)
