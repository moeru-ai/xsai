import type { Promisable } from '@xsai/shared'

export interface ModelCatalog {
  list: (options?: ModelCatalogOptions) => Promisable<ModelCatalogEntry[]>
  retrieve: (options: ModelCatalogOptions & { id: string }) => Promisable<ModelCatalogEntry>
}

export interface ModelCatalogEntry {
  id: string
  providerMetadata?: ModelCatalogProviderMetadata
}

export interface ModelCatalogOptions {
  providerOptions?: ModelCatalogProviderOptions
  signal?: AbortSignal
}

export interface ModelCatalogProviderMetadata {}

export interface ModelCatalogProviderOptions {}
