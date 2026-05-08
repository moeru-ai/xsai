import type { Tool } from '@xsai/shared-chat'

import type { CreateResponseBody, ItemParam } from '../generated'

export interface OpenResponsesOptions extends CamelCaseProperties<Omit<NoNullCreateResponseBody, 'input' | 'model' | 'stream' | 'tools'>> {
  input: ItemParam[] | string
  model: string
  /** @remarks `@xsai-ext/responses` only supports `stream: true`, so you should not set it. */
  stream?: never
  tools?: Tool[]
}

type CamelCaseProperties<T> = {
  [K in keyof T as K extends string
    ? SnakeToCamel<K>
    : never]: CamelCaseValue<T[K]>
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
