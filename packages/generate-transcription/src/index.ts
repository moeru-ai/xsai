import type { CommonRequestOptions } from '@xsai/shared'

import { requestHeaders, requestURL, responseJSON } from '@xsai/shared'

export interface GenerateTranscriptionOptions<T extends 'word' | 'segment' | undefined = undefined> extends CommonRequestOptions {
  file: Blob
  fileName?: string
  language?: string
  prompt?: string
  temperature?: string
  /** @default `segment` */
  timestampGranularities?: T
}

export interface GenerateTranscriptionResult<T extends 'word' | 'segment' | undefined = undefined> {
  duration: number
  language: string
  segments: T extends 'word' ? never : GenerateTranscriptionResultSegment[]
  text: string
  words: T extends 'word' ? GenerateTranscriptionResultWord[] : never
}

/** @see {@link https://platform.openai.com/docs/api-reference/audio/verbose-json-object#audio/verbose-json-object-segments} */
export interface GenerateTranscriptionResultSegment {
  avg_logprob: number
  compression_ratio: number
  end: number
  id: number
  no_speech_prob: number
  seek: number
  start: number
  temperature: number
  text: string
  tokens: number[]
}

/** @see {@link https://platform.openai.com/docs/api-reference/audio/verbose-json-object#audio/verbose-json-object-words} */
export interface GenerateTranscriptionResultWord {
  end: number
  start: number
  word: string
}

export const generateTranscription = async <T extends 'word' | 'segment' | undefined = undefined>(options: GenerateTranscriptionOptions<T>): Promise<GenerateTranscriptionResult<T>> => {
  const body = new FormData()

  body.append('model', options.model)
  body.append('file', options.file, options.fileName)
  body.append('response_format', 'verbose_json')
  body.append('timestamp_granularities[]', options.timestampGranularities ?? 'segment')

  if (options.language != null)
    body.append('language', options.language)

  if (options.prompt != null)
    body.append('prompt', options.prompt)

  if (options.temperature != null)
    body.append('temperature', options.temperature)

  return (options.fetch ?? globalThis.fetch)(requestURL('audio/transcriptions', options.baseURL), {
    body,
    headers: requestHeaders(options.headers, options.apiKey),
    method: 'POST',
    signal: options.abortSignal,
  })
    .then(responseJSON<GenerateTranscriptionResult<T>>)
}
