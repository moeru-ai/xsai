export * from './core/collect'
export * from './core/tool'
export type * from './core/types'

export type { PostToolCall, PreToolCall } from './loop/execute-tools'
export * from './loop/loop'
export * from './loop/stop-condition'
export type * from './loop/types/prepare-step'

export { HttpError, XSAIError } from './shared'
export type { XSAIErrorCause, XSAIErrorCauseMap, XSAIErrorCode, XSAIErrorOptions } from './shared'
export type * from './utils/schema'

declare module '@xsai/shared' {
  interface XSAIErrorCauseMap {
    'model-error': unknown
    'protocol-error': unknown
    'truncated-stream': undefined
  }
}
