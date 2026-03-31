export interface APICallErrorOptions extends XSAIErrorOptions {
  requestBody?: string
  response: Response
  responseBody?: string
}

export interface InvalidModelResponseErrorOptions extends XSAIErrorOptions {
  responseBody?: string
}

export interface InvalidResponseErrorOptions extends XSAIErrorOptions {
  body?: unknown
  contentType?: null | string
  reason: 'empty_body' | 'invalid_body'
  response?: Response
}

export interface InvalidToolCallErrorOptions extends XSAIErrorOptions {
  reason: 'missing_arguments' | 'missing_name'
  toolCall: unknown
}

export interface InvalidToolInputErrorOptions extends XSAIErrorOptions {
  toolInput: unknown
  toolName: string
}

export interface JSONParseErrorOptions extends XSAIErrorOptions {
  text: string
}

export interface NoSuchToolErrorOptions extends XSAIErrorOptions {
  availableTools?: string[]
  toolName: string
}

export interface RemoteAPIErrorOptions extends XSAIErrorOptions {
  response?: Response
  responseBody: string
}

export interface StreamChunkParseErrorOptions extends XSAIErrorOptions {
  chunk: string
}

export interface ToolExecutionErrorOptions extends InvalidToolInputErrorOptions {
  toolCallId?: string
}

export type XSAIErrorCode
  = | 'api_call_error'
    | 'invalid_model_response'
    | 'invalid_response'
    | 'invalid_tool_call'
    | 'invalid_tool_input'
    | 'json_parse_error'
    | 'no_choices_returned'
    | 'no_such_tool'
    | 'remote_api_error'
    | 'stream_chunk_parse_error'
    | 'tool_execution_error'

export interface XSAIErrorOptions {
  cause?: unknown
}

export class XSAIError extends Error {
  code: XSAIErrorCode

  constructor(message: string, code: XSAIErrorCode, options: XSAIErrorOptions = {}) {
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

export class InvalidModelResponseError extends XSAIError {
  responseBody?: string

  constructor(message: string, code: 'invalid_model_response' | 'no_choices_returned', options: InvalidModelResponseErrorOptions = {}) {
    super(message, code, options)
    this.responseBody = options.responseBody
  }
}

export class InvalidResponseError extends XSAIError {
  body?: unknown
  contentType?: null | string
  reason: InvalidResponseErrorOptions['reason']
  response?: Response

  constructor(message: string, options: InvalidResponseErrorOptions) {
    super(message, 'invalid_response', options)
    this.body = options.body
    this.contentType = options.contentType
    this.reason = options.reason
    this.response = options.response
  }
}

export class InvalidToolCallError extends XSAIError {
  reason: InvalidToolCallErrorOptions['reason']
  toolCall: unknown

  constructor(message: string, options: InvalidToolCallErrorOptions) {
    super(message, 'invalid_tool_call', options)
    this.reason = options.reason
    this.toolCall = options.toolCall
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

export class NoChoicesReturnedError extends InvalidModelResponseError {
  constructor(message: string, options: InvalidModelResponseErrorOptions = {}) {
    super(message, 'no_choices_returned', options)
  }
}

export class NoSuchToolError extends XSAIError {
  availableTools?: string[]
  toolName: string

  constructor(message: string, options: NoSuchToolErrorOptions) {
    super(message, 'no_such_tool', options)
    this.availableTools = options.availableTools
    this.toolName = options.toolName
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

export class StreamChunkParseError extends XSAIError {
  chunk: string

  constructor(message: string, options: StreamChunkParseErrorOptions) {
    super(message, 'stream_chunk_parse_error', options)
    this.chunk = options.chunk
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
