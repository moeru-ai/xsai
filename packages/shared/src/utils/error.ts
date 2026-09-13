export type XSAIErrorCause<T extends XSAIErrorCode>
  = Exclude<XSAIErrorCauseMap[T], undefined>

export interface XSAIErrorCauseMap {
  'http-error': undefined
  'invalid-input': undefined
  'invalid-response': unknown
}

export type XSAIErrorCode = keyof XSAIErrorCauseMap

export type XSAIErrorOptions<T extends XSAIErrorCode> = undefined extends XSAIErrorCauseMap[T]
  ? [options?: { cause?: XSAIErrorCause<T> }]
  : [options: { cause: XSAIErrorCause<T> }]

export class XSAIError<T extends XSAIErrorCode = XSAIErrorCode> extends Error {
  readonly code: T

  constructor(code: T, message: string, ...[options]: XSAIErrorOptions<T>) {
    super(message, options)
    this.code = code
    this.name = new.target.name
  }

  static isInstance<T extends XSAIError>(this: new (...args: never[]) => T, error: unknown): error is T {
    return error instanceof this
  }
}

export class HttpError extends XSAIError<'http-error'> {
  readonly body: string
  readonly status: number

  constructor(status: number, body: string, ...options: XSAIErrorOptions<'http-error'>) {
    super('http-error', `HTTP ${status}: ${body}`, ...options)
    this.body = body
    this.status = status
  }
}
