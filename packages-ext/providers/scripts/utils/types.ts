export interface CodeGenProvider {
  /** api key env name */
  apiKey?: string
  baseURL: string
  capabilities?: {
    embed?: boolean
    /** @default true */
    model?: boolean
  }
  doc: string
  /** used by meta name */
  id: string
  /** used by type-hint */
  models: string[]
  name: string
}

/**
 * currently unused
 * @see {@link https://github.com/sst/models.dev#schema-reference}
 */
export interface Model {
  id: string
}

/** @see {@link https://github.com/sst/models.dev#schema-reference} */
export interface Provider {
  api?: string
  doc: string
  env: string[]
  id: string
  models: Record<string, Model>
  name: string
  npm: string
}

export type Providers = Record<string, Provider>
