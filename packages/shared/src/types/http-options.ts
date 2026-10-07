export interface HttpOptions {
  apiKey?: string
  /** @example `https://api.openai.com/v1/` */
  baseURL: string | URL
  fetch?: (request: Request) => Promise<Response>
  headers?: Record<string, string | undefined>
  model: string
}
