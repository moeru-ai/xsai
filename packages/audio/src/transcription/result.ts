export interface TranscriptionResult {
  durationInSeconds?: number
  languages?: string[]
  segments?: TranscriptionSegment[]
  text: string
  words?: TranscriptionWord[]
}

export interface TranscriptionSegment {
  endSecond: number
  id?: string
  providerMetadata?: {
    transcription?: {
      avgLogprob?: number
      compressionRatio?: number
      noSpeechProb?: number
      seek?: number
      temperature?: number
      tokens?: number[]
    }
  }
  speakerId?: string
  startSecond: number
  text: string
}

export interface TranscriptionWord {
  endSecond: number
  providerMetadata?: {
    transcription?: {
      probability?: number
    }
  }
  startSecond: number
  text: string
}
