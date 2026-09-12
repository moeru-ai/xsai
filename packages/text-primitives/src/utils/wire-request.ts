import type { HttpOptions } from '@xsai/shared'

import type { Event, LanguageModelOptions } from '../core'

import { EventSourceDataStream, EventSourceParserStream } from './event-source-stream'
import { requestHeaders } from './request-headers'
import { requestURL } from './request-url'
import { responseCatch } from './response-catch'

export interface WireRequestInit {
  /** Wire-shaped body fields; merged over both extraBody levels. */
  body: Record<string, unknown>
  /** Require the SSE stream to end with a `[DONE]` frame. */
  checkDone?: boolean
  /** Overrides the default `Authorization`/`Content-Type` headers. */
  headers?: Record<string, string>
  path: string
}

/**
 * The fields of `fields` whose values are defined — spread into a request
 * body so absent options neither emit nor mask `extraBody` keys.
 * @internal
 */
export const onlyDefined = (fields: Record<string, unknown>): Record<string, unknown> =>
  Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== undefined))

/**
 * One nested `extraBody` field merged across the two levels: model-call
 * options over request options.
 * @internal
 */
export const mergedExtra = (
  options: HttpOptions,
  modelOptions: LanguageModelOptions | undefined,
  key: string,
): Record<string, unknown> => ({
  ...options.extraBody?.[key] as Record<string, unknown>,
  ...modelOptions?.extraBody?.[key] as Record<string, unknown>,
})

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
      ...options.extraBody,
      ...modelOptions?.extraBody,
      ...init.body,
    }),
    headers: init.headers ?? requestHeaders(options.apiKey, options.extraHeaders),
    method: 'POST',
    signal: modelOptions?.signal,
  })
    .then(responseCatch)
    .then(res => res.body
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new EventSourceParserStream())
      .pipeThrough(new EventSourceDataStream(init.checkDone))
      .pipeThrough(eventStream))
