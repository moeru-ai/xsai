import type { Fetch } from './fetch'

export interface CommonRequestOptions {
  abortSignal?: AbortSignal
  apiKey?: string
  /** @example `https://api.openai.com/v1/` */
  baseURL: string | URL
  fetch?: Fetch | typeof globalThis.fetch
  /** @default `undefined` */
  headers?: Headers | Record<string, string>
  /** @example `gpt-4o` */
  model: string
}
