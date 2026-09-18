export * from './core'
export * from './utils'

declare module '@xsai/shared' {
  interface XSAIErrorCauseMap {
    'model-error': unknown
    'protocol-error': unknown
    'truncated-stream': undefined
  }
}
