export interface APICallErrorOptions extends ErrorOptions {
  requestBody?: string
  response: Response
  responseBody?: string
}
export interface InvalidResponseErrorOptions extends ErrorOptions {
  body?: unknown
  contentType?: null | string
  reason: InvalidResponseReason
  response?: Response
  responseBody?: string
}

export type InvalidResponseReason = 'empty_body' | 'invalid_body' | 'no_choices'

export interface InvalidToolCallErrorOptions extends ErrorOptions {
  availableTools?: string[]
  reason: InvalidToolCallReason
  toolCall: unknown
  toolName?: string
}

export type InvalidToolCallReason = 'missing_arguments' | 'missing_name' | 'tool_call_id_mismatch' | 'unknown_tool'

export interface InvalidToolInputErrorOptions extends ErrorOptions {
  toolInput: unknown
  toolName: string
}

export interface JSONParseErrorOptions extends ErrorOptions {
  text: string
}

export interface RemoteAPIErrorOptions extends ErrorOptions {
  response?: Response
  responseBody: string
}

export interface ToolExecutionErrorOptions extends InvalidToolInputErrorOptions {
  toolCallId?: string
}

export type XSAIErrorCode
  = | 'api_call_error'
    | 'invalid_response'
    | 'invalid_tool_call'
    | 'invalid_tool_input'
    | 'json_parse_error'
    | 'remote_api_error'
    | 'tool_execution_error'

export class XSAIError extends Error {
  declare code: (string & {}) | XSAIErrorCode

  constructor(message: string, code: (string & {}) | XSAIErrorCode, options: ErrorOptions = {}) {
    super(message, { cause: options.cause })
    this.code = code
    this.name = new.target.name
  }

  static isInstance<T extends abstract new (...args: any[]) => XSAIError>(this: T, error: unknown): error is InstanceType<T> {
    return error instanceof this
  }
}

export class APICallError extends XSAIError {
  declare requestBody?: string
  declare response: Response
  declare responseBody?: string
  declare responseHeaders: Record<string, string>
  declare statusCode: number
  declare statusText: string
  declare url: string

  constructor(message: string, options: APICallErrorOptions) {
    super(message, 'api_call_error', options)
    this.requestBody = options.requestBody
    this.response = options.response
    this.responseBody = options.responseBody
    this.responseHeaders = Object.fromEntries(options.response.headers.entries())
    this.statusCode = options.response.status
    this.statusText = options.response.statusText
    this.url = options.response.url
  }
}

export class InvalidResponseError extends XSAIError {
  declare body?: unknown
  declare contentType?: null | string
  declare reason: InvalidResponseErrorOptions['reason']
  declare response?: Response
  declare responseBody?: string

  constructor(message: string, options: InvalidResponseErrorOptions) {
    super(message, 'invalid_response', options)
    Object.assign(this, options)
  }
}

export class InvalidToolCallError extends XSAIError {
  declare availableTools?: string[]
  declare reason: InvalidToolCallErrorOptions['reason']
  declare toolCall: unknown
  declare toolName?: string

  constructor(message: string, options: InvalidToolCallErrorOptions) {
    super(message, 'invalid_tool_call', options)
    Object.assign(this, options)
  }
}

export class InvalidToolInputError extends XSAIError {
  declare toolInput: unknown
  declare toolName: string

  constructor(message: string, options: InvalidToolInputErrorOptions) {
    super(message, 'invalid_tool_input', options)
    Object.assign(this, options)
  }
}

export class JSONParseError extends XSAIError {
  declare text: string

  constructor(message: string, options: JSONParseErrorOptions) {
    super(message, 'json_parse_error', options)
    this.text = options.text
  }
}

export class RemoteAPIError extends XSAIError {
  declare response?: Response
  declare responseBody: string

  constructor(message: string, options: RemoteAPIErrorOptions) {
    super(message, 'remote_api_error', options)
    Object.assign(this, options)
  }
}

export class ToolExecutionError extends XSAIError {
  declare toolCallId?: string
  declare toolInput: unknown
  declare toolName: string

  constructor(message: string, options: ToolExecutionErrorOptions) {
    super(message, 'tool_execution_error', options)
    Object.assign(this, options)
  }
}
