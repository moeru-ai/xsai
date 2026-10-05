export interface TranscriptionEndEvent extends TranscriptionResult {
  type: 'transcription.end'
}

export type TranscriptionEvent
  = | TranscriptionEndEvent
    | TranscriptionStartEvent
    | TranscriptionTextDeltaEvent
    | TranscriptionTextSegmentEvent

export interface TranscriptionResult {
  durationInSeconds?: number
  language?: string
  segments?: TranscriptionSegment[]
  text: string
  words?: TranscriptionWord[]
}

export interface TranscriptionSegment {
  endSecond: number
  id?: string
  providerMetadata?: {
    transcriptions?: {
      avgLogprob?: number
      compressionRatio?: number
      noSpeechProb?: number
      seek?: number
      speaker?: string
      temperature?: number
      tokens?: number[]
    }
  }
  startSecond: number
  text: string
}

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

export interface TranscriptionWord {
  endSecond: number
  providerMetadata?: {
    transcriptions?: {
      probability?: number
    }
  }
  startSecond: number
  text: string
}
