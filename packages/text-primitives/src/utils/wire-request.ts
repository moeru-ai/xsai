import type { HttpOptions } from '@xsai/shared'

import type { Event, LanguageModelOptions } from '../core'

import { XSAIError } from '@xsai/shared'

import { EventSourceDataStream, EventSourceParserStream } from './event-source-stream'
import { requestHeaders } from './request-headers'
import { requestURL } from './request-url'
import { responseCatch } from './response-catch'

export interface WireRequestInit {
  /** Wire-shaped body fields; `undefined` fields are dropped before the model-call extraBody merge. */
  body: Record<string, unknown>
  /** Overrides the default `Authorization`/`Content-Type` headers; `undefined` values are dropped. */
  headers?: Record<string, string | undefined>
  path: string
}

const definedOnly = <V>(fields: Record<string, undefined | V>): Record<string, V> =>
  Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== undefined)) as Record<string, V>

/**
 * The shared wire-request mechanic: POST JSON to `init.path`, decode the SSE
 * stream, and translate frames through `eventStream`. Wire adapters supply
 * only their body fields and event stream.
 * @internal
 */
export const wireRequest = async (
  options: HttpOptions,
  modelOptions: LanguageModelOptions | undefined,
  init: WireRequestInit,
  eventStream: TransformStream<string, Event>,
): Promise<ReadableStream<Event>> => {
  const url = requestURL(init.path, options.baseURL)

  return (options.fetch ?? fetch)(url, {
    body: JSON.stringify({
      ...modelOptions?.extraBody,
      ...definedOnly(init.body),
    }),
    headers: definedOnly(init.headers ?? requestHeaders(options.apiKey, options.extraHeaders)),
    method: 'POST',
    signal: modelOptions?.signal,
  })
    .catch((cause: unknown) => {
      // An aborted request carries the caller's reason; it is not a network error.
      if (modelOptions?.signal?.aborted)
        throw cause
      throw new XSAIError('network-error', `request to ${url.toString()} failed`, { cause })
    })
    .then(responseCatch)
    .then(res => res.body
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new EventSourceParserStream())
      .pipeThrough(new EventSourceDataStream())
      .pipeThrough(eventStream))
}
