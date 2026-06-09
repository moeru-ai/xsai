import type { CommonRequestOptions, WithUnknown } from '@xsai/shared'

import { postJSON } from '@xsai/shared'

export interface GenerateSpeechOptions extends CommonRequestOptions {
  /** The text to generate audio for.  */
  input: string
  /** Control the voice of your generated audio with additional instructions. */
  instructions?: string
  /**
   * The format to audio in.
   * @default `mp3`
   */
  responseFormat?: 'aac' | 'flac' | 'mp3' | 'opus' | 'pcm' | 'wav'
  /**
   * The speed of the generated audio.
   * @default 1.0
   */
  speed?: number
  /** If you want to enable stream, use `@xsai/stream-speech`. */
  streamFormat?: never
  /** The voice to use when generating the audio. */
  voice: string
}

export const generateSpeech = async (options: WithUnknown<GenerateSpeechOptions>): Promise<ArrayBuffer> =>
  postJSON('audio/speech', options)
    .then(async res => res.arrayBuffer())
