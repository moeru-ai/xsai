import type { HttpOptions, Promisable } from '@xsai/shared'

import type { TranscriptionEvent } from './event'

import { postJSON, XSAIError } from '@xsai/shared'
import { EventSourceParserStream } from 'eventsource-parser/stream'

import { transcriptionBody, TranscriptionEventStream, TranscriptionResultStream } from './wire'

export type TranscriptionModel = (options: TranscriptionOptions) => Promisable<ReadableStream<TranscriptionEvent>>

export interface TranscriptionOptions {
  audio: Blob
  fileName?: string
  language?: string
  providerOptions?: TranscriptionProviderOptions
  signal?: AbortSignal
}

export interface TranscriptionProviderOptions {
  transcription?: {
    chunkingStrategy?: 'auto'
    prompt?: string
    responseFormat?: 'diarized_json' | 'json' | 'verbose_json'
    temperature?: number
    timestampGranularities?: ('segment' | 'word')[]
  }
}

export const transcription = (options: HttpOptions): TranscriptionModel => async (modelOptions) => {
  const response = await postJSON(options, {
    body: transcriptionBody(options.model, modelOptions, true),
    path: 'audio/transcriptions',
    signal: modelOptions.signal,
  })
  const mime = response.headers.get('Content-Type')?.split(';', 1)[0]?.trim().toLowerCase()
  if (mime !== 'text/event-stream') {
    const error = new XSAIError('invalid-response', 'Expected an SSE transcription response')
    await response.body.cancel(error).catch(() => {})
    throw error
  }
  return response.body
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new EventSourceParserStream())
    .pipeThrough(new TranscriptionEventStream(), { signal: modelOptions.signal })
}

export const transcriptionNonStreaming = (options: HttpOptions): TranscriptionModel => async (modelOptions) => {
  const response = await postJSON(options, {
    body: transcriptionBody(options.model, modelOptions),
    path: 'audio/transcriptions',
    signal: modelOptions.signal,
  })
  return response.body
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TranscriptionResultStream(), { signal: modelOptions.signal })
}
