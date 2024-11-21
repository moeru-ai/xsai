export interface CommonRequestOptions {
  /** @default `http://localhost:11434/v1` */
  base?: string
  /** @default `undefined` */
  headers?: Headers | Record<string, string>
}

export const base = 'http://localhost:11434/v1/'
