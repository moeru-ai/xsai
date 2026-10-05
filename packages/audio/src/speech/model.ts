import type { Promisable } from '@xsai/shared'

export type SpeechModel = (options: SpeechOptions) => Promisable<Response>

export interface SpeechOptions {
  input: string
  providerOptions?: SpeechProviderOptions
  signal?: AbortSignal
  voice: string
}

export interface SpeechProviderOptions {}
