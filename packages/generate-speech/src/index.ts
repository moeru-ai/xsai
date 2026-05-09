import type { CommonRequestOptions, WithUnknown } from '@xsai/shared'

import { postJSON } from '@xsai/shared'

export interface GenerateSpeechOptions extends CommonRequestOptions {
  input: string
  /** @default `mp3` */
  responseFormat?: 'aac' | 'flac' | 'mp3' | 'opus' | 'pcm' | 'wav'
  /** @default `1.0` */
  speed?: number
  voice: string
}

export const generateSpeech = async (options: WithUnknown<GenerateSpeechOptions>): Promise<ArrayBuffer> =>
  postJSON('audio/speech', options)
    .then(async res => res.arrayBuffer())
