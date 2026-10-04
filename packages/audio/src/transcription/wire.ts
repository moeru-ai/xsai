import type { EventSourceMessage } from 'eventsource-parser/stream'

import type { TranscriptionEvent } from './event'
import type { TranscriptionOptions } from './model'
import type { TranscriptionResult, TranscriptionSegment } from './result'

import { XSAIError } from '@xsai/shared'

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
  words?: { end: number, start: number, word: string }[]
}

interface WireSegment {
  end: number
  id?: number | string
  speaker?: string
  start: number
  text: string
}

export const transcriptionBody = (model: string, options: TranscriptionOptions, streaming = false): FormData => {
  const wireOptions = options.providerOptions?.transcription
  const body = new FormData()
  body.append('file', options.audio)
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
  for (const granularity of wireOptions?.timestampGranularities ?? [])
    body.append('timestamp_granularities[]', granularity)
  return body
}

export const transcriptionSegment = (value: WireSegment): TranscriptionSegment => ({
  endSecond: value.end,
  ...(value.id == null ? {} : { id: String(value.id) }),
  ...(value.speaker == null ? {} : { speakerId: value.speaker }),
  startSecond: value.start,
  text: value.text,
})

export const transcriptionResult = (value: unknown): TranscriptionResult => {
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
          words: result.words.map(word => ({ endSecond: word.end, startSecond: word.start, text: word.word })),
        }),
  }
}

export class TranscriptionEventStream extends TransformStream<EventSourceMessage, TranscriptionEvent> {
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

export class TranscriptionResultStream extends TransformStream<string, TranscriptionEvent> {
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
