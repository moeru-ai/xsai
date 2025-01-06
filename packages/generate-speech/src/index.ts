import { type CommonRequestOptions, requestBody, requestHeaders, requestURL, responseCatch } from '@xsai/shared'

export interface GenerateSpeechOptions extends CommonRequestOptions {
  [key: string]: unknown
  input: string
  /** @default `mp3` */
  responseFormat?: 'aac' | 'flac' | 'mp3' | 'opus' | 'pcm' | 'wav'
  /** @default `1.0` */
  speed?: number
  voice: string
}

/**
 * @experimental WIP
 * @param options generate speech options.
 * @returns audio array buffer
 */
export const generateSpeech = async (options: GenerateSpeechOptions): Promise<ArrayBuffer> =>
  await (options.fetch ?? globalThis.fetch)(requestURL('audio/speech', options.baseURL), {
    body: requestBody(options),
    headers: requestHeaders({
      'Content-Type': 'application/json',
      ...options.headers,
    }, options.apiKey),
    method: 'POST',
    signal: options.abortSignal,
  })
    .then(responseCatch)
    .then(res => res.arrayBuffer())

export default generateSpeech
