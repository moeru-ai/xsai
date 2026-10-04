import type { TranscriptionResult, TranscriptionSegment } from './result'

export interface TranscriptionEndEvent extends TranscriptionResult {
  type: 'transcription.end'
}

export type TranscriptionEvent
  = | TranscriptionEndEvent
    | TranscriptionStartEvent
    | TranscriptionTextDeltaEvent
    | TranscriptionTextSegmentEvent

export interface TranscriptionStartEvent {
  type: 'transcription.start'
}

export interface TranscriptionTextDeltaEvent {
  delta: string
  segmentId?: string
  type: 'transcription.text.delta'
}

export interface TranscriptionTextSegmentEvent extends TranscriptionSegment {
  type: 'transcription.text.segment'
}
