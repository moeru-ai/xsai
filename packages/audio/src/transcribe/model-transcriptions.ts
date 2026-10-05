import type { HttpOptions } from '@xsai/shared'
import type { EventSourceMessage } from 'eventsource-parser/stream'

import type { TranscriptionEvent, TranscriptionResult, TranscriptionSegment } from './event'
import type { TranscriptionModel, TranscriptionOptions } from './model'

import { postJSON, XSAIError } from '@xsai/shared'
import { EventSourceParserStream } from 'eventsource-parser/stream'

export interface TranscriptionProviderOptions {
  transcriptions?: {
    chunkingStrategy?: 'auto'
    prompt?: string
    responseFormat?: 'diarized_json' | 'json' | 'verbose_json'
    temperature?: number
    timestampGranularities?: ('segment' | 'word')[]
  }
}

type WireEvent
  = (WireSegment & { type: 'transcript.text.segment' })
    | { delta: string, segment_id?: string, type: 'transcript.text.delta' }
    | { error?: unknown, type: 'error' }
    | { languages?: { code: string }[], text: string, type: 'transcript.text.done' }

interface WireResult {
  duration?: number
  language?: string
  languages?: { code: string }[]
  segments?: WireSegment[]
  text: string
  words?: { end: number, probability?: number, start: number, word: string }[]
}

interface WireSegment {
  avg_logprob?: number
  compression_ratio?: number
  end: number
  id?: number | string
  no_speech_prob?: number
  seek?: number
  speaker?: string
  start: number
  temperature?: number
  text: string
  tokens?: number[]
}

const transcriptionBody = (model: string, options: TranscriptionOptions, streaming = false): FormData => {
  const wireOptions = options.providerOptions?.transcriptions
  const body = new FormData()
  if (options.fileName == null)
    body.append('file', options.audio)
  else
    body.append('file', options.audio, options.fileName)
  for (const [key, value] of Object.entries({
    chunking_strategy: wireOptions?.chunkingStrategy,
    language: options.language,
    model,
    prompt: wireOptions?.prompt,
    response_format: wireOptions?.responseFormat ?? 'json',
    stream: streaming ? true : undefined,
    temperature: wireOptions?.temperature,
  })) {
    if (value != null)
      body.append(key, String(value))
  }
  for (const granularity of wireOptions?.timestampGranularities ?? (wireOptions?.responseFormat === 'verbose_json' ? ['segment'] : []))
    body.append('timestamp_granularities[]', granularity)
  return body
}

const transcriptionSegment = (value: WireSegment): TranscriptionSegment => {
  const metadata = {
    ...(value.avg_logprob == null ? {} : { avgLogprob: value.avg_logprob }),
    ...(value.compression_ratio == null ? {} : { compressionRatio: value.compression_ratio }),
    ...(value.no_speech_prob == null ? {} : { noSpeechProb: value.no_speech_prob }),
    ...(value.seek == null ? {} : { seek: value.seek }),
    ...(value.temperature == null ? {} : { temperature: value.temperature }),
    ...(value.tokens == null ? {} : { tokens: value.tokens }),
  }
  return {
    endSecond: value.end,
    ...(value.id == null ? {} : { id: String(value.id) }),
    ...(Object.keys(metadata).length === 0 ? {} : { providerMetadata: { transcriptions: metadata } }),
    ...(value.speaker == null ? {} : { speakerId: value.speaker }),
    startSecond: value.start,
    text: value.text,
  }
}

const transcriptionResult = (value: unknown): TranscriptionResult => {
  if (value == null || typeof value !== 'object' || !('text' in value) || typeof value.text !== 'string')
    throw new XSAIError('invalid-response', 'Expected transcription text to be a string', { cause: value })
  const result = value as WireResult
  const languages = result.languages?.map(language => language.code) ?? (result.language == null ? undefined : [result.language])
  return {
    ...(result.duration == null ? {} : { durationInSeconds: result.duration }),
    ...(languages == null ? {} : { languages }),
    ...(result.segments == null ? {} : { segments: result.segments.map(transcriptionSegment) }),
    text: result.text,
    ...(result.words == null
      ? {}
      : {
          words: result.words.map(word => ({
            endSecond: word.end,
            ...(word.probability == null ? {} : { providerMetadata: { transcriptions: { probability: word.probability } } }),
            startSecond: word.start,
            text: word.word,
          })),
        }),
  }
}

class TranscriptionEventStream extends TransformStream<EventSourceMessage, TranscriptionEvent> {
  constructor() {
    const segments: TranscriptionSegment[] = []
    super({
      flush: () => {
        throw new XSAIError('truncated-stream', 'transcription stream ended without transcript.text.done')
      },
      start: output => output.enqueue({ type: 'transcription.start' }),
      transform: ({ data }, output) => {
        if (data === '' || data === '[DONE]')
          return
        const event = JSON.parse(data) as WireEvent
        if (event == null || typeof event !== 'object')
          throw new XSAIError('invalid-response', 'Expected a transcription event object', { cause: event })
        if (event.type === 'error' || ('error' in event && event.error != null))
          throw new XSAIError('invalid-response', 'Transcription provider reported an error', { cause: 'error' in event ? event.error : event })
        if (event.type === 'transcript.text.delta') {
          output.enqueue({
            delta: event.delta,
            ...(event.segment_id == null ? {} : { segmentId: event.segment_id }),
            type: 'transcription.text.delta',
          })
        }
        else if (event.type === 'transcript.text.segment') {
          const segment = transcriptionSegment(event)
          segments.push(segment)
          output.enqueue({ ...segment, type: 'transcription.text.segment' })
        }
        else if (event.type === 'transcript.text.done') {
          output.enqueue({
            ...transcriptionResult(event),
            ...(segments.length === 0 ? {} : { segments }),
            type: 'transcription.end',
          })
          output.terminate()
        }
      },
    })
  }
}

class TranscriptionResultStream extends TransformStream<string, TranscriptionEvent> {
  constructor() {
    let text = ''
    super({
      flush: (output) => {
        output.enqueue({ ...transcriptionResult(JSON.parse(text)), type: 'transcription.end' })
      },
      start: output => output.enqueue({ type: 'transcription.start' }),
      transform: (chunk) => { text += chunk },
    })
  }
}

export const transcriptions = (options: HttpOptions): TranscriptionModel => async (modelOptions) => {
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

export const transcriptionsNonStreaming = (options: HttpOptions): TranscriptionModel => async (modelOptions) => {
  const response = await postJSON(options, {
    body: transcriptionBody(options.model, modelOptions),
    path: 'audio/transcriptions',
    signal: modelOptions.signal,
  })
  return response.body
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TranscriptionResultStream(), { signal: modelOptions.signal })
}
