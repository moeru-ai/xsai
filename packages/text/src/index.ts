export { collect } from './collect'
export type { CollectResult } from './collect'
export * from './generate-text'
export * from './loop'
export * from './stop-condition'
export * from './stream-text'
export { TextEventTarget, toCustomEvent, withEventTarget } from './text-event-target'
export * from './tool'
export type * from './types'
export type { PostToolCall, PreToolCall } from './utils/execute-tools'
export type * from './utils/schema'
export { HttpError, XSAIError } from '@xsai/shared'
export type { XSAIErrorCause, XSAIErrorCauseMap, XSAIErrorCode, XSAIErrorOptions } from '@xsai/shared'

declare module '@xsai/shared' {
  interface XSAIErrorCauseMap {
    'model-error': unknown
    'protocol-error': unknown
  }
}
