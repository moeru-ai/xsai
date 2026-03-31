export interface APICallErrorOptions extends ErrorOptions {
  requestBody?: string
  response: Response
  responseBody?: string
}

export interface InvalidResponseErrorOptions extends ErrorOptions {
  body?: unknown
  contentType?: null | string
  reason: 'empty_body' | 'invalid_body' | 'no_choices'
  response?: Response
  responseBody?: string
}

export interface InvalidToolCallErrorOptions extends ErrorOptions {
  availableTools?: string[]
  reason: 'missing_arguments' | 'missing_name' | 'unknown_tool'
  toolCall: unknown
  toolName?: string
}

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
  code: XSAIErrorCode

  constructor(message: string, code: XSAIErrorCode, options: ErrorOptions = {}) {
    super(message, { cause: options.cause })
    this.code = code
    this.name = new.target.name
  }

  static isInstance<T extends typeof XSAIError>(this: T, error: unknown): error is InstanceType<T> {
    return error instanceof this
  }
}

export class APICallError extends XSAIError {
  isRetryable: boolean
  requestBody?: string
  response: Response
  responseBody?: string
  responseHeaders: Record<string, string>
  statusCode: number
  statusText: string
  url: string

  constructor(message: string, options: APICallErrorOptions) {
    super(message, 'api_call_error', options)
    this.isRetryable = options.response.status === 408 || options.response.status === 409 || options.response.status === 429 || options.response.status >= 500
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
  body?: unknown
  contentType?: null | string
  reason: InvalidResponseErrorOptions['reason']
  response?: Response
  responseBody?: string

  constructor(message: string, options: InvalidResponseErrorOptions) {
    super(message, 'invalid_response', options)
    this.body = options.body
    this.contentType = options.contentType
    this.reason = options.reason
    this.response = options.response
    this.responseBody = options.responseBody
  }
}

export class InvalidToolCallError extends XSAIError {
  availableTools?: string[]
  reason: InvalidToolCallErrorOptions['reason']
  toolCall: unknown
  toolName?: string

  constructor(message: string, options: InvalidToolCallErrorOptions) {
    super(message, 'invalid_tool_call', options)
    this.availableTools = options.availableTools
    this.reason = options.reason
    this.toolCall = options.toolCall
    this.toolName = options.toolName
  }
}

export class InvalidToolInputError extends XSAIError {
  toolInput: unknown
  toolName: string

  constructor(message: string, options: InvalidToolInputErrorOptions) {
    super(message, 'invalid_tool_input', options)
    this.toolInput = options.toolInput
    this.toolName = options.toolName
  }
}

export class JSONParseError extends XSAIError {
  text: string

  constructor(message: string, options: JSONParseErrorOptions) {
    super(message, 'json_parse_error', options)
    this.text = options.text
  }
}

export class RemoteAPIError extends XSAIError {
  response?: Response
  responseBody: string

  constructor(message: string, options: RemoteAPIErrorOptions) {
    super(message, 'remote_api_error', options)
    this.response = options.response
    this.responseBody = options.responseBody
  }
}

export class ToolExecutionError extends XSAIError {
  toolCallId?: string
  toolInput: unknown
  toolName: string

  constructor(message: string, options: ToolExecutionErrorOptions) {
    super(message, 'tool_execution_error', options)
    this.toolCallId = options.toolCallId
    this.toolInput = options.toolInput
    this.toolName = options.toolName
  }
}
