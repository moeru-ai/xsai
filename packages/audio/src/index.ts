export * from './speech'
export * from './transcribe'

declare module '@xsai/shared' {
  interface XSAIErrorCauseMap {
    'truncated-stream': undefined
  }
}
