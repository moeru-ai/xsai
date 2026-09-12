export class HttpError extends Error {
  readonly body: string
  readonly status: number

  constructor(status: number, body: string) {
    super(`HTTP ${status}: ${body}`)
    this.name = 'HttpError'
    this.body = body
    this.status = status
  }
}
