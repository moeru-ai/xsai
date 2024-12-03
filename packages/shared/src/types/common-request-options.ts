export interface CommonRequestOptions {
  abortSignal?: AbortSignal
  /** @default `undefined` */
  headers?: Headers | Record<string, string>
  url: string | URL
}
