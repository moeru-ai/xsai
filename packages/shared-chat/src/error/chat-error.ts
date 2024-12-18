export class ChatError extends Error {
  response?: Response

  constructor(message: string, response?: Response) {
    super(message)
    this.name = 'ChatError'
    this.response = response
  }
}
