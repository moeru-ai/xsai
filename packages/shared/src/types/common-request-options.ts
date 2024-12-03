export interface CommonRequestOptions {
  abortSignal?: AbortSignal
  /** @default `undefined` */
  headers?: Headers | Record<string, string>
  model: string
  url: string | URL
}
