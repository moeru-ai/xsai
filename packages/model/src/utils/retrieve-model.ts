import { type CommonRequestOptions, requestHeaders } from '@xsai/shared'

import type { Model } from '../types/model'

export interface RetrieveModelOptions extends Omit<CommonRequestOptions, 'model'> {}

export const retrieveModel = async (options: RetrieveModelOptions): Promise<Model> =>
  await fetch(options.url, {
    headers: requestHeaders({
      'Content-Type': 'application/json',
      ...options.headers,
    }, options.apiKey),
    signal: options.abortSignal,
  })
    .then(res => res.json() as Promise<Model>)
