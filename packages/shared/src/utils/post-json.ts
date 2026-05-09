import type { CommonRequestOptions, WithUnknown } from '../types'

import { requestBody } from './request-body'
import { requestHeaders } from './request-headers'
import { requestURL } from './request-url'
import { responseCatch } from './response-catch'

export const postJSON = async (path: string, options: WithUnknown<CommonRequestOptions>) =>
  (options.fetch ?? globalThis.fetch)(requestURL(path, options.baseURL), {
    body: requestBody(options),
    headers: requestHeaders({
      'Content-Type': 'application/json',
      ...options.headers,
    }, options.apiKey),
    method: 'POST',
    signal: options.abortSignal,
  }).then(responseCatch)
