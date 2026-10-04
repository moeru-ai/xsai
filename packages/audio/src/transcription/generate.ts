import type { TranscriptionModel, TranscriptionOptions } from './model'
import type { TranscriptionResult } from './result'

import { XSAIError } from '@xsai/shared'

export const generateTranscription = async (
  model: TranscriptionModel,
  options: TranscriptionOptions,
): Promise<TranscriptionResult> => {
  let result: TranscriptionResult | undefined
  for await (const event of await model(options)) {
    if (event.type === 'transcription.end') {
      const { type: _, ...value } = event
      result = value
    }
  }
  if (result == null)
    throw new XSAIError('truncated-stream', 'model stream ended without a transcription.end event')
  return result
}
