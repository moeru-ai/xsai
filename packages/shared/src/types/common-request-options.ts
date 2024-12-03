export interface CommonRequestOptions {
  abortSignal?: AbortSignal
  /** @default `undefined` */
  headers?: Headers | Record<string, string>
  /** @example `gpt-4o` */
  model: string
  /** @example `https://openai.com/v1/chat/completions` */
  url: string | URL
}
