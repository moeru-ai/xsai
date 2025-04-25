import type { CommonRequestOptions } from '@xsai/shared'

import { requestHeaders, requestURL, responseJSON } from '@xsai/shared'

export interface GenerateTranscriptionOptions extends CommonRequestOptions {
  file: Blob
  fileName?: string
  language?: string
  prompt?: string
  temperature?: string

  // response_format?: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt'
  // timestamp_granularities?: ('segment' | 'word')[]
}

export interface GenerateTranscriptionResult {
  text: string
}

export const generateTranscription = async (options: GenerateTranscriptionOptions): Promise<GenerateTranscriptionResult> => {
  const body = new FormData()

  body.append('model', options.model)
  body.append('file', options.file, options.fileName)
  options.language != null && body.append('language', options.language)
  options.prompt != null && body.append('prompt', options.prompt)
  options.temperature != null && body.append('temperature', options.temperature)

  return (options.fetch ?? globalThis.fetch)(requestURL('audio/transcriptions', options.baseURL), {
    body,
    headers: requestHeaders(options.headers, options.apiKey),
    method: 'POST',
    signal: options.abortSignal,
  })
    .then(responseJSON<GenerateTranscriptionResult>)
    .then(({ text }) => ({ text: text.trim() }))
}
