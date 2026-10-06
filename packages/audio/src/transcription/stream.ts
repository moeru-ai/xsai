import type { TranscriptionEvent } from './event'
import type { TranscriptionModel, TranscriptionModelOptions } from './model'

export const streamTranscription = async (
  model: TranscriptionModel,
  options: TranscriptionModelOptions,
): Promise<ReadableStream<TranscriptionEvent>> => model(options)
