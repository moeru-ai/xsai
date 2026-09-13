import type { HttpOptions } from '@xsai/shared'

import type { Event, LanguageModelOptions } from '../core'

import { EventSourceDataStream, EventSourceParserStream } from './event-source-stream'
import { requestHeaders } from './request-headers'
import { requestURL } from './request-url'
import { responseCatch } from './response-catch'

export interface WireRequestInit {
  /** Wire-shaped body fields; `undefined` fields are dropped before the model-call extraBody merge. */
  body: Record<string, unknown>
  /** Require the SSE stream to end with a `[DONE]` frame. */
  checkDone?: boolean
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
): Promise<ReadableStream<Event>> =>
  (options.fetch ?? fetch)(requestURL(init.path, options.baseURL), {
    body: JSON.stringify({
      ...modelOptions?.extraBody,
      ...definedOnly(init.body),
    }),
    headers: definedOnly(init.headers ?? requestHeaders(options.apiKey, options.extraHeaders)),
    method: 'POST',
    signal: modelOptions?.signal,
  })
    .then(responseCatch)
    .then(res => res.body
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new EventSourceParserStream())
      .pipeThrough(new EventSourceDataStream(init.checkDone))
      .pipeThrough(eventStream))
