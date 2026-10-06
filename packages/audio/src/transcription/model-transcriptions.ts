import type { EventSourceMessage, HttpOptions } from '@xsai/shared'

import type { TranscriptionEvent, TranscriptionResult, TranscriptionSegment } from './event'
import type { TranscriptionModel, TranscriptionModelOptions } from './model'

import { EventSourceParserStream, postJSON, XSAIError } from '@xsai/shared'

declare module '@xsai/audio' {
  interface TranscriptionModelProviderOptions {
    transcriptions?: {
      chunkingStrategy?: 'auto'
      prompt?: string
      responseFormat?: 'diarized_json' | 'json' | 'verbose_json'
      temperature?: number
      timestampGranularities?: ('segment' | 'word')[]
    }
  }

  interface TranscriptionSegmentProviderMetadata {
    transcriptions?: {
      avgLogprob?: number
      compressionRatio?: number
      noSpeechProb?: number
      seek?: number
      speaker?: string
      temperature?: number
      tokens?: number[]
    }
  }

  interface TranscriptionWordProviderMetadata {
    transcriptions?: {
      probability?: number
    }
  }
}

type OpenAITranscriptionsEvent
  = (OpenAITranscriptionsSegment & { type: 'transcript.text.segment' })
    | { delta: string, segment_id?: string, type: 'transcript.text.delta' }
    | { error?: unknown, type: 'error' }
    | { text: string, type: 'transcript.text.done' }

interface OpenAITranscriptionsResult {
  duration?: number
  language?: string
  segments?: OpenAITranscriptionsSegment[]
  text: string
  words?: { end: number, probability?: number, start: number, word: string }[]
}

interface OpenAITranscriptionsSegment {
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

const transcriptionBody = (model: string, options: TranscriptionModelOptions, streaming = false): FormData => {
  const wireOptions = options.providerOptions?.transcriptions
  const body = new FormData()
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

const transcriptionSegment = (value: OpenAITranscriptionsSegment): TranscriptionSegment => {
  const metadata = {
    avgLogprob: value.avg_logprob,
    compressionRatio: value.compression_ratio,
    noSpeechProb: value.no_speech_prob,
    seek: value.seek,
    speaker: value.speaker,
    temperature: value.temperature,
    tokens: value.tokens,
  }
  return {
    endSecond: value.end,
    id: value.id?.toString(),
    providerMetadata: Object.values(metadata).some(value => value != null) ? { transcriptions: metadata } : undefined,
    startSecond: value.start,
    text: value.text,
  }
}

const transcriptionResult = (value: unknown): TranscriptionResult => {
  if (value == null || typeof value !== 'object' || !('text' in value) || typeof value.text !== 'string')
    throw new XSAIError('invalid-response', 'Expected transcription text to be a string', { cause: value })
  const result = value as OpenAITranscriptionsResult
  return {
    durationInSeconds: result.duration,
    language: result.language,
    segments: result.segments?.map(transcriptionSegment),
    text: result.text,
    words: result.words?.map(word => ({
      endSecond: word.end,
      providerMetadata: word.probability == null ? undefined : { transcriptions: { probability: word.probability } },
      startSecond: word.start,
      text: word.word,
    })),
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
        const event = JSON.parse(data) as OpenAITranscriptionsEvent
        if (event == null || typeof event !== 'object')
          throw new XSAIError('invalid-response', 'Expected a transcription event object', { cause: event })
        if (event.type === 'error' || ('error' in event && event.error != null))
          throw new XSAIError('invalid-response', 'Transcription provider reported an error', { cause: 'error' in event ? event.error : event })
        if (event.type === 'transcript.text.delta') {
          output.enqueue({
            delta: event.delta,
            segmentId: event.segment_id,
            type: 'transcription.text.delta',
          })
        }
        else if (event.type === 'transcript.text.segment') {
          const segment = transcriptionSegment(event)
          segments.push(segment)
          output.enqueue({ ...segment, type: 'transcription.text.segment' })
        }
        else if (event.type === 'transcript.text.done') {
          const result = transcriptionResult(event)
          output.enqueue({
            ...result,
            segments: segments.length > 0 ? segments : result.segments,
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
