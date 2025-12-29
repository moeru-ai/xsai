import type { CommonRequestOptions } from '@xsai/shared'

import type { Model } from '../types/model'

import { requestHeaders, requestURL, responseCatch, responseJSON } from '@xsai/shared'

export const retrieveModel = async (options: CommonRequestOptions): Promise<Model> =>
  (options.fetch ?? globalThis.fetch)(requestURL(`models/${options.model}`, options.baseURL), {
    headers: requestHeaders(options.headers, options.apiKey),
    signal: options.abortSignal,
  })
    .then(responseCatch)
    .then(responseJSON<Model>)
