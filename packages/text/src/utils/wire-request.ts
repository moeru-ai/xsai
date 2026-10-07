import type { HttpOptions, SendRequestOptions } from '@xsai/shared'

import type { LanguageModelOptions, TextEvent } from '../types'

import { EventSourceParserStream, sendRequest } from '@xsai/shared'

import { EventSourceDataStream } from './event-source-stream'

/** @internal */
export const wireRequest = async (
  options: SendRequestOptions,
  httpOptions: HttpOptions,
  modelOptions: LanguageModelOptions,
  eventStream: TransformStream<string, TextEvent>,
): Promise<ReadableStream<TextEvent>> =>
  sendRequest({
    ...options,
    signal: modelOptions.signal,
  }, httpOptions)
    .then(res => res.body
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new EventSourceParserStream())
      .pipeThrough(new EventSourceDataStream())
      .pipeThrough(eventStream))
