import { type CommonRequestOptions, requestHeaders, requestURL } from '@xsai/shared'

import type { Model } from '../types/model'

export interface RetrieveModelOptions extends CommonRequestOptions {}

export const retrieveModel = async (options: RetrieveModelOptions): Promise<Model> =>
  await (options.fetch ?? globalThis.fetch)(requestURL(`models/${options.model}`, options.baseURL), {
    headers: requestHeaders({
      'Content-Type': 'application/json',
      ...options.headers,
    }, options.apiKey),
    signal: options.abortSignal,
  })
    .then(res => res.json() as Promise<Model>)
