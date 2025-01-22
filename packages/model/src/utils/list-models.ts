import { type CommonRequestOptions, requestHeaders, requestURL, responseJSON } from '@xsai/shared'

import type { Model } from '../types/model'

export interface ListModelsOptions extends Omit<CommonRequestOptions, 'model'> {}

export interface ListModelsResponse {
  data: Model[]
  object: 'list'
}

export const listModels = async (options: ListModelsOptions): Promise<Model[]> =>
  (options.fetch ?? globalThis.fetch)(requestURL('models', options.baseURL), {
    headers: requestHeaders({
      'Content-Type': 'application/json',
      ...options.headers,
    }, options.apiKey),
    signal: options.abortSignal,
  })
    .then(responseJSON<ListModelsResponse>)
    .then(({ data }) => data)
