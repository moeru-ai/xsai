export class XSAIError extends Error {
  response?: Response

  constructor(message: string, response?: Response) {
    super(message)
    this.name = 'XSAIError'
    this.response = response
  }
}
