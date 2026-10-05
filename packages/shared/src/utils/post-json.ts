import type { HttpOptions } from '../types'

import { HttpError, XSAIError } from './error'

export interface PostJSONInit {
  body?: FormData | Record<string, unknown>
  headers?: Record<string, string | undefined>
  method?: 'GET' | 'POST'
  path: string
  signal?: AbortSignal
}

export const requestURL = (path: string, baseURL: string | URL) => {
  const base = baseURL.toString()
  return new URL(path, base.endsWith('/') ? base : `${base}/`)
}

export const postJSON = async (options: Omit<HttpOptions, 'model'>, init: PostJSONInit): Promise<Response & { body: NonNullable<Response['body']> }> => {
  const url = requestURL(init.path, options.baseURL)
  const headers = init.headers ?? {
    ...options.headers,
    'Authorization': options.apiKey == null ? options.headers?.Authorization : `Bearer ${options.apiKey}`,
    'Content-Type': init.body instanceof FormData ? undefined : init.body == null ? options.headers?.['Content-Type'] : 'application/json',
  }

  const responseCatch = async (res: Response): Promise<Response & { body: NonNullable<Response['body']> }> => {
    if (!res.ok)
      throw new HttpError({ body: await res.text(), headers: res.headers, status: res.status })

    if (res.body == null)
      throw new XSAIError('invalid-response', 'Response body is empty')

    if (!(res.body instanceof ReadableStream))
      throw new XSAIError('invalid-response', `Expected Response body to be a ReadableStream, but got ${typeof res.body}`)

    return res as Response & { body: NonNullable<Response['body']> }
  }

  const requestCatch = (cause: unknown): never => {
    init.signal?.throwIfAborted()
    throw new XSAIError('network-error', `request to ${url.toString()} failed`, {
      cause: cause ?? new Error('fetch rejected without a reason'),
    })
  }

  return (options.fetch ?? fetch)(url, {
    body: init.body == null ? undefined : init.body instanceof FormData ? init.body : JSON.stringify(init.body),
    headers: Object.fromEntries(Object.entries(headers).filter(([name, value]) =>
      value !== undefined && (!(init.body instanceof FormData) || name.toLowerCase() !== 'content-type'),
    )) as Record<string, string>,
    method: init.method ?? 'POST',
    signal: init.signal,
  })
    .then(responseCatch, requestCatch)
}
