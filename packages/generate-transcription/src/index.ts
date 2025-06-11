import type { CommonRequestOptions } from '@xsai/shared'

import { requestHeaders, requestURL, responseJSON } from '@xsai/shared'

export interface GenerateTranscriptionOptions<
  T1 extends GenerateTranscriptionOptionsResponseFormat = undefined,
  T2 extends GenerateTranscriptionOptionsTimeStampGranularities = undefined,
> extends CommonRequestOptions {
  file: Blob
  fileName?: string
  language?: string
  prompt?: string
  /** @default `json` */
  responseFormat?: T1
  temperature?: string
  /** @default `segment` */
  timestampGranularities?: T2
}

export type GenerateTranscriptionOptionsResponseFormat = 'json' | 'verbose_json' | undefined

export type GenerateTranscriptionOptionsTimeStampGranularities = 'segment' | 'word' | undefined

export interface GenerateTranscriptionResult<
  T1 extends GenerateTranscriptionOptionsResponseFormat = undefined,
  T2 extends GenerateTranscriptionOptionsTimeStampGranularities = undefined,
> {
  duration: T1 extends 'verbose_json' ? number : never
  language: T1 extends 'verbose_json' ? string : never
  segments: T1 extends 'verbose_json'
    ? T2 extends 'word'
      ? never
      : GenerateTranscriptionResultSegment[]
    : never
  text: string
  words: T1 extends 'verbose_json'
    ? T2 extends 'word'
      ? GenerateTranscriptionResultWord[]
      : never
    : never
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

export const generateTranscription = async <
  T1 extends GenerateTranscriptionOptionsResponseFormat = undefined,
  T2 extends GenerateTranscriptionOptionsTimeStampGranularities = undefined,
>(options: GenerateTranscriptionOptions<T1, T2>): Promise<GenerateTranscriptionResult<T1, T2>> => {
  const body = new FormData()

  body.append('model', options.model)
  body.append('file', options.file, options.fileName)
  body.append('response_format', options.responseFormat ?? 'json')

  // make ts happy
  // eslint-disable-next-line ts/no-unnecessary-type-assertion
  if (options.responseFormat as GenerateTranscriptionOptionsResponseFormat === 'verbose_json')
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
    .then(responseJSON<GenerateTranscriptionResult<T1, T2>>)
}
