export interface TranscriptionResult {
  durationInSeconds?: number
  languages?: string[]
  segments?: TranscriptionSegment[]
  text: string
  words?: TranscriptionWord[]
}

export interface TranscriptionSegment extends TranscriptionWord {
  id?: string
  speakerId?: string
}

export interface TranscriptionWord {
  endSecond: number
  startSecond: number
  text: string
}
