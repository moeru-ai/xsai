import type { CommonRequestOptions } from '@xsai/shared'

import { requestHeaders, requestURL, responseJSON } from '@xsai/shared'

import type { Model } from '../types/model'

export interface RetrieveModelOptions extends CommonRequestOptions {}

export const retrieveModel = async (options: RetrieveModelOptions): Promise<Model> =>
  (options.fetch ?? globalThis.fetch)(requestURL(`models/${options.model}`, options.baseURL), {
    headers: requestHeaders({
      'Content-Type': 'application/json',
      ...options.headers,
    }, options.apiKey),
    signal: options.abortSignal,
  })
    .then(responseJSON<Model>)
