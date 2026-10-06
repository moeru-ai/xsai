import type { HttpOptions } from '@xsai/shared'

import type { ModelCatalog } from './model'

import { postJSON } from '@xsai/shared'

declare module '@xsai/model' {
  interface ModelCatalogEntryProviderMetadata {
    models?: {
      created?: number
      ownedBy?: string
    }
  }
}

interface OpenAIModel {
  created: number
  id: string
  owned_by: string
}

const modelEntry = (model: OpenAIModel) => ({
  id: model.id,
  providerMetadata: { models: { created: model.created, ownedBy: model.owned_by } },
})

export const models = (options: Omit<HttpOptions, 'model'>): ModelCatalog => ({
  list: async (catalogOptions = {}) => {
    const response = await postJSON(options, { method: 'GET', path: 'models', signal: catalogOptions.signal })
    const json = await response.json() as { data: OpenAIModel[] }
    return json.data.map(modelEntry)
  },
  retrieve: async (catalogOptions) => {
    const response = await postJSON(options, { method: 'GET', path: `models/${encodeURIComponent(catalogOptions.id)}`, signal: catalogOptions.signal })
    return modelEntry(await response.json() as OpenAIModel)
  },
})
