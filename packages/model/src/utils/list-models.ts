import { type CommonRequestOptions, requestHeaders } from '@xsai/shared'

import type { Model } from '../types/model'

export interface ListModelsOptions extends Omit<CommonRequestOptions, 'model'> {}

export interface ListModelsResponse {
  data: Model[]
  object: 'list'
}

export const listModels = async (options: ListModelsOptions): Promise<Model[]> =>
  await fetch(new URL('models', options.baseURL), {
    headers: requestHeaders({
      'Content-Type': 'application/json',
      ...options.headers,
    }, options.apiKey),
    signal: options.abortSignal,
  })
    .then(res => res.json() as Promise<ListModelsResponse>)
    .then(({ data }) => data)
