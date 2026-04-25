import type { CreateResponseBody, ItemParam } from '../generated'
import type { ExecutableTool } from '../utils/tool'
import type { PrepareStep } from './prepare-step'

export interface OpenResponsesOptions extends CamelCaseProperties<Omit<NoNullCreateResponseBody, 'input' | 'stream' | 'tools'>> {
  input: ItemParam[] | string
  prepareStep?: PrepareStep
  /** @remarks `@xsai-ext/responses` only supports `stream: true`, so you should not set it. */
  stream?: never
  tools?: ExecutableTool[]
}

type CamelCaseProperties<T> = {
  [K in keyof T as K extends string
    ? SnakeToCamel<K>
    : never]?: CamelCaseValue<T[K]>
}

type CamelCaseValue<T> = T extends readonly unknown[]
  ? T
  : T extends object
    ? CamelCaseProperties<T>
    : T

type NoNull<T> = {
  [P in keyof T]: T[P] extends null ? Exclude<T[P], null> : T[P];
}

type NoNullCreateResponseBody = NoNull<CreateResponseBody>

type SnakeToCamel<T extends string> = T extends `${infer H}_${infer R}`
  ? `${H}${Capitalize<SnakeToCamel<R>>}`
  : T
