import type { CommonRequestOptions } from '@xsai/shared'

import { requestBody, requestHeaders, requestURL, responseCatch } from '@xsai/shared'

export interface GenerateSpeechOptions extends CommonRequestOptions {
  [key: string]: unknown
  input: string
  /** @default `false` */
  isPlayer2?: boolean
  /** @default `mp3` */
  responseFormat?: 'aac' | 'flac' | 'mp3' | 'opus' | 'pcm' | 'wav'
  /** @default `1.0` */
  speed?: number
  voice: string
}

export const generateSpeech = async (options: GenerateSpeechOptions): Promise<ArrayBuffer> => {
  if (options.isPlayer2) {
    // special case for player2
    const { input, responseFormat, speed, voice, ...rest } = options
    return (options.fetch ?? globalThis.fetch)(requestURL('tts/speak', options.baseURL), {
      body: requestBody({
        audio_format: responseFormat,
        play_in_app: false,
        speed: speed ?? 1.0,
        text: input,
        voice_ids: voice
          ? []
          : [
              voice,
            ],
        ...rest,
      }),
      headers: requestHeaders({
        'Content-Type': 'application/json',
        ...options.headers,
      }, options.apiKey),
      method: 'POST',
      signal: options.abortSignal,

    }).then(responseCatch).then(async res => res.arrayBuffer())
  }
  return (options.fetch ?? globalThis.fetch)(requestURL('audio/speech', options.baseURL), {
    body: requestBody(options),
    headers: requestHeaders({
      'Content-Type': 'application/json',
      ...options.headers,
    }, options.apiKey),
    method: 'POST',
    signal: options.abortSignal,
  })
    .then(responseCatch)
    .then(async res => res.arrayBuffer())
}
