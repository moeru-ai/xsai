import type { ModelCatalog, ModelCatalogOptions } from './model'

export const listModels = async (catalog: ModelCatalog, options: ModelCatalogOptions = {}) =>
  catalog.list(options)
