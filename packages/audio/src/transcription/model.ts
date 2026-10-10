import type { Promisable } from '@xsai/shared'

import type { TranscriptionEvent } from './event'

export type TranscriptionModel = (options: TranscriptionModelOptions) => Promisable<ReadableStream<TranscriptionEvent>>

export interface TranscriptionModelOptions {
  audio: Blob
  fileName?: string
  language?: string
  providerOptions?: TranscriptionModelProviderOptions
  signal?: AbortSignal
}

export interface TranscriptionModelProviderOptions {}
