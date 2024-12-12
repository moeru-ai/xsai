import { type CommonRequestOptions, requestHeaders } from '@xsai/shared'

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

/**
 * WIP, test failed
 */
export const generateTranscription = async (options: GenerateTranscriptionOptions): Promise<GenerateTranscriptionResult> => {
  const body = new FormData()

  body.append('model', options.model)
  body.append('file', options.file, options.fileName)

  return await (options.fetch ?? globalThis.fetch)(new URL('audio/transcriptions', options.baseURL), {
    body,
    headers: requestHeaders(options.headers, options.apiKey),
    method: 'POST',
    signal: options.abortSignal,
  })
    .then(async (res) => {
      if (res.ok) {
        return res.json() as Promise<GenerateTranscriptionResult>
      }
      else {
        throw new Error(`Error(${res.status}): ${await res.text()}`)
      }
    })
    .then(({ text }) => ({ text: text.trim() }))
}

export default generateTranscription
