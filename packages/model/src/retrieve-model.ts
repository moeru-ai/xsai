import type { ModelCatalog, ModelCatalogOptions } from './model'

export const retrieveModel = async (catalog: ModelCatalog, options: ModelCatalogOptions & { id: string }) =>
  catalog.retrieve(options)
