export interface CommonRequestOptions {
  abortSignal?: AbortSignal
  apiKey?: string
  /**
   * @example `https://openai.com/v1/`
   * @remarks make sure the baseURL ends with a slash.
   */
  baseURL: string | URL
  /** @default `undefined` */
  headers?: Headers | Record<string, string>
  /** @example `gpt-4o` */
  model: string
}
