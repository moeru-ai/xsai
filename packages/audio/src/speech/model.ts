import type { Promisable } from '@xsai/shared'

export type SpeechModel = (options: SpeechModelOptions) => Promisable<Response>

export interface SpeechModelOptions {
  input: string
  providerOptions?: SpeechModelProviderOptions
  signal?: AbortSignal
  voice: string
}

export interface SpeechModelProviderOptions {}
