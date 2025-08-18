import type { CommonRequestOptions } from '@xsai/shared'

import { requestHeaders, requestURL, responseCatch, responseJSON } from '@xsai/shared'

import type { Model } from '../types/model'

export interface ListModelsOptions extends Omit<CommonRequestOptions, 'model'> {}

export interface ListModelsResponse {
  data: Model[]
  object: 'list'
}

export const listModels = async (options: ListModelsOptions): Promise<Model[]> =>
  (options.fetch ?? globalThis.fetch)(requestURL('models', options.baseURL), {
    headers: requestHeaders(options.headers, options.apiKey),
    signal: options.abortSignal,
  })
    .then(responseCatch)
    .then(responseJSON<ListModelsResponse>)
    .then(({ data }) => data)
