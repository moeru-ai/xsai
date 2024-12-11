import { type CommonRequestOptions, requestHeaders } from '@xsai/shared'

export interface GenerateTranscriptionOptions extends CommonRequestOptions {
  // TODO: FIXME: file type
  file: unknown
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
  // TODO: FIXME: file type
  body.append('file', options.file as any)

  return await (options.fetch ?? globalThis.fetch)(new URL('audio/transcriptions', options.baseURL), {
    body,
    headers: requestHeaders({
      'Content-Type': 'multipart/form-data',
      ...options.headers,
    }, options.apiKey),
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
