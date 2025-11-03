export interface CodeGenProvider {
  /** api key env name */
  apiKey: string[]
  baseURL: string
  capabilities?: CodeGenProviderCapabilities
  doc: string
  /** used by meta name */
  id: string
  /** used by type-hint */
  models: string[]
  name: string
  overrides?: CodeGenProviderOverrides
}

export interface CodeGenProviderCapabilities {
  embed?: boolean
  image?: boolean
  /** @default true */
  model?: boolean
  speech?: boolean
  transcription?: boolean
}

export interface CodeGenProviderOverrides {
  /** `Bar` = `createFoo` => `createBar` */
  create?: string
  /** `bar` = `const foo = createFoo()` => `const bar = createFoo()` */
  id?: string
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
  _capabilities?: CodeGenProviderCapabilities
  _overrides?: CodeGenProviderOverrides
  api?: string
  doc: string
  env: string[]
  id: string
  models: Record<string, Model>
  name: string
  npm: string
}

export type Providers = Record<string, Provider>
