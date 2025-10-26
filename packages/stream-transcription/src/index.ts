import type { GenerateTranscriptionOptions } from '@xsai/generate-transcription'
import type { CommonRequestOptions } from '@xsai/shared'

import { requestHeaders, requestURL, responseCatch, responseJSON } from '@xsai/shared'

export interface StreamTranscriptionDelta {
  delta: string
  type: StreamTranscriptionDeltaType
}

export type StreamTranscriptionDeltaType = 'transcription.text.delta' | 'transcription.text.done'
export interface StreamTranscriptionOptions extends GenerateTranscriptionOptions {
  responseFormat?: never
  timestampGranularities?: never
}

export interface StreamTranscriptionResult {
  fullStream: ReadableStream<StreamTranscriptionDelta>
  textStream: ReadableStream<string>
}
