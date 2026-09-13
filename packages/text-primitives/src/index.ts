export * from './core'
export * from './utils'

declare module '@xsai/shared' {
  interface XSAIErrorCauseMap {
    'model-error': unknown
    'truncated-stream': undefined
  }
}
