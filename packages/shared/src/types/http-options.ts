export type Fetch = (request: Request) => Promise<Response>

export interface HttpOptions {
  apiKey?: string
  /** @example `https://api.openai.com/v1/` */
  baseURL: string | URL
  fetch?: Fetch
  headers?: Record<string, string | undefined>
  model: string
}
