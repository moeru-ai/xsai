export * from './speech'
export * from './transcription'

declare module '@xsai/shared' {
  interface XSAIErrorCauseMap {
    'truncated-stream': undefined
  }
}
