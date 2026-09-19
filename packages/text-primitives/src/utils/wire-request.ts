import type { HttpOptions } from '@xsai/shared'

import type { LanguageModelOptions, TextEvent } from '../core'

import { HttpError, XSAIError } from '@xsai/shared'

import { EventSourceDataStream, EventSourceParserStream } from './event-source-stream'

export interface WireRequestInit {
  body: Record<string, unknown>
  headers?: Record<string, string | undefined>
  path: string
}

const definedOnly = <V>(fields: Record<string, undefined | V>): Record<string, V> =>
  Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== undefined)) as Record<string, V>

const responseCatch = async (res: Response): Promise<Response & { body: NonNullable<Response['body']> }> => {
  if (!res.ok)
    throw new HttpError({ body: await res.text(), headers: res.headers, status: res.status })

  if (res.body === null)
    throw new XSAIError('invalid-response', 'Response body is empty')

  if (!(res.body instanceof ReadableStream))
    throw new XSAIError('invalid-response', `Expected Response body to be a ReadableStream, but got ${typeof res.body}`)

  return res as Response & { body: NonNullable<Response['body']> }
}

/** Sends a request and transforms its SSE body. @internal */
export const wireRequest = async (
  options: HttpOptions,
  modelOptions: LanguageModelOptions,
  init: WireRequestInit,
  eventStream: TransformStream<string, TextEvent>,
): Promise<ReadableStream<TextEvent>> => {
  const base = options.baseURL.toString()
  const url = new URL(init.path, base.endsWith('/') ? base : `${base}/`)

  const requestCatch = (cause: unknown): never => {
    if (modelOptions.signal?.aborted)
      throw cause
    throw new XSAIError('network-error', `request to ${url.toString()} failed`, {
      cause: cause ?? new Error('fetch rejected without a reason'),
    })
  }

  return (options.fetch ?? fetch)(url, {
    // Ignore undefined overrides so they cannot erase normalized fields.
    body: JSON.stringify({
      ...init.body,
      ...definedOnly(modelOptions.extraBody ?? {}),
    }),
    headers: definedOnly(init.headers ?? {
      ...options.extraHeaders,
      'Content-Type': 'application/json',
      ...(options.apiKey == null ? {} : { Authorization: `Bearer ${options.apiKey}` }),
    }),
    method: 'POST',
    signal: modelOptions.signal,
  })
    .then(responseCatch, requestCatch)
    .then(res => res.body
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new EventSourceParserStream())
      .pipeThrough(new EventSourceDataStream())
      .pipeThrough(eventStream))
}
