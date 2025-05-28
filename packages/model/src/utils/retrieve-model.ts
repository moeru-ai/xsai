import type { CommonRequestOptions } from '@xsai/shared'

import { requestHeaders, requestURL, responseJSON } from '@xsai/shared'

import type { Model } from '../types/model'

export const retrieveModel = async (options: CommonRequestOptions): Promise<Model> =>
  (options.fetch ?? globalThis.fetch)(requestURL(`models/${options.model}`, options.baseURL), {
    headers: requestHeaders(options.headers, options.apiKey),
    signal: options.abortSignal,
  })
    .then(responseJSON<Model>)
