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
  /** @default `undefined` */
  specialTag?: 'player2' // | "other_provider" // used for non standard api's that require extra work before making fetch, i.e. renaming inputs, etc. can add | 'otherprovider' in the future
}
