import type { HttpOptions } from '@xsai/shared'

import type { Model } from './model'

import { postJSON } from '@xsai/shared'

export interface ListModelsOptions extends Omit<HttpOptions, 'model'> {
  signal?: AbortSignal
}

export interface ListModelsResponse {
  data: Model[]
  object: 'list'
}

export const listModels = async (options: ListModelsOptions): Promise<Model[]> => {
  const response = await postJSON(options, { method: 'GET', path: 'models', signal: options.signal })
  const { data } = await response.json() as ListModelsResponse
  return data
}
