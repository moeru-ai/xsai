export interface HttpOptions {
  apiKey?: string
  /** @example `https://api.openai.com/v1/` */
  baseURL: string | URL
  fetch?: typeof fetch
  headers?: Record<string, string | undefined>
  model: string
}
