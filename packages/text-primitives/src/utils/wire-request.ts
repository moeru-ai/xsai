import type { HttpOptions } from '@xsai/shared'

import type { LanguageModelOptions, TextEvent } from '../core'

import { EventSourceParserStream, postJSON } from '@xsai/shared'

import { EventSourceDataStream } from './event-source-stream'

export interface WireRequestInit {
  body: Record<string, unknown>
  headers?: Record<string, string | undefined>
  path: string
}

/** Sends a request and transforms its SSE body. @internal */
export const wireRequest = async (
  options: HttpOptions,
  modelOptions: LanguageModelOptions,
  init: WireRequestInit,
  eventStream: TransformStream<string, TextEvent>,
): Promise<ReadableStream<TextEvent>> => {
  return postJSON(options, {
    ...init,
    signal: modelOptions.signal,
  })
    .then(res => res.body
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new EventSourceParserStream())
      .pipeThrough(new EventSourceDataStream())
      .pipeThrough(eventStream))
}
