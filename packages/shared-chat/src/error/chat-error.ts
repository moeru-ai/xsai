export class ChatCompletionsError extends Error {
  response?: Response

  constructor(message: string, response?: Response) {
    super(message)
    this.name = 'ChatCompletionsError'
    this.response = response
  }
}
