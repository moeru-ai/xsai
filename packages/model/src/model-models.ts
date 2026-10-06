import type { HttpOptions } from '@xsai/shared'

import type { RetrieveModel } from './model'

import { postJSON } from '@xsai/shared'

declare module '@xsai/model' {
  interface RetrieveModelProviderMetadata {
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

const modelResult = (model: OpenAIModel) => ({
  id: model.id,
  providerMetadata: { models: { created: model.created, ownedBy: model.owned_by } },
})

export const models = (options: Omit<HttpOptions, 'model'>): RetrieveModel => ({
  list: async (modelOptions = {}) => {
    const response = await postJSON(options, { method: 'GET', path: 'models', signal: modelOptions.signal })
    const json = await response.json() as { data: OpenAIModel[] }
    return json.data.map(modelResult)
  },
  retrieve: async (modelOptions) => {
    const response = await postJSON(options, { method: 'GET', path: `models/${encodeURIComponent(modelOptions.model)}`, signal: modelOptions.signal })
    return modelResult(await response.json() as OpenAIModel)
  },
})
