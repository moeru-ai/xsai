import type { TranscriptionEvent } from './event'
import type { TranscriptionModel, TranscriptionOptions } from './model'

export const streamTranscribe = async (
  model: TranscriptionModel,
  options: TranscriptionOptions,
): Promise<ReadableStream<TranscriptionEvent>> => model(options)
