import type { Promisable } from '@xsai/shared'

import type { TranscriptionEvent } from './event'
import type { TranscriptionProviderOptions } from './model-transcriptions'

export type TranscriptionModel = (options: TranscriptionOptions) => Promisable<ReadableStream<TranscriptionEvent>>

export interface TranscriptionOptions {
  audio: Blob
  fileName?: string
  language?: string
  providerOptions?: TranscriptionProviderOptions
  signal?: AbortSignal
}
