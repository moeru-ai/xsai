export interface HttpOptions {
  apiKey?: string
  /** @example `https://api.openai.com/v1/` */
  baseURL: string | URL
  extraHeaders?: Record<string, string>
  fetch?: typeof fetch
  model: string
}
