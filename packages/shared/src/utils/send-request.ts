import type { HttpOptions } from '../types'

import { HttpError, XSAIError } from './error'

export interface SendRequestOptions {
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

export const sendRequest = async (options: SendRequestOptions, httpOptions: Omit<HttpOptions, 'model'>): Promise<Response & { body: NonNullable<Response['body']> }> => {
  const url = requestURL(options.path, httpOptions.baseURL)
  const headers = options.headers ?? {
    ...httpOptions.headers,
    'Authorization': httpOptions.apiKey == null ? httpOptions.headers?.Authorization : `Bearer ${httpOptions.apiKey}`,
    'Content-Type': options.body instanceof FormData ? undefined : options.body == null ? httpOptions.headers?.['Content-Type'] : 'application/json',
  }

  const responseCatch = async (res: Response): Promise<Response & { body: NonNullable<Response['body']> }> => {
    if (!res.ok)
      throw new HttpError({ body: await res.text(), headers: res.headers, status: res.status })

    if (res.body == null)
      throw new XSAIError('invalid-response', 'Response body is empty')

    return res as Response & { body: NonNullable<Response['body']> }
  }

  const requestCatch = (cause: unknown): never => {
    options.signal?.throwIfAborted()
    throw new XSAIError('network-error', `request to ${url.toString()} failed`, {
      cause: cause ?? new Error('fetch rejected without a reason'),
    })
  }

  const request = new Request(url, {
    body: options.body == null ? undefined : options.body instanceof FormData ? options.body : JSON.stringify(options.body),
    headers: Object.fromEntries(Object.entries(headers).filter(([name, value]) =>
      value !== undefined && (!(options.body instanceof FormData) || name.toLowerCase() !== 'content-type'),
    )) as Record<string, string>,
    method: options.method ?? 'POST',
    signal: options.signal,
  })

  return (httpOptions.fetch ?? fetch)(request)
    .then(responseCatch, requestCatch)
}
