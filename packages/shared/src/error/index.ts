export class XSAIError extends Error {
  response?: Response

  constructor(message: string, response?: Response, cause?: unknown) {
    super(message, { cause })
    this.name = 'XSAIError'
    this.response = response
  }
}
