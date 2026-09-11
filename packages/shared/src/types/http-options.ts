export interface HttpOptions {
  apiKey?: string
  /** @example `https://api.openai.com/v1/` */
  baseURL: string | URL
  extraBody?: Record<string, unknown>
  extraHeaders?: Record<string, string>
  fetch?: typeof fetch
  model: string
}
