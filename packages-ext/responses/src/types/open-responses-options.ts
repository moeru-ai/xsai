import type { CreateResponseBody, ItemParam } from '../generated'
import type { ExecutableTool } from '../utils/tool'

export interface OpenResponsesOptions extends Omit<NoNullCreateResponseBody, 'input' | 'stream' | 'tools'> {
  input: ItemParam[] | string
  /** @remarks `@xsai-ext/responses` only supports `stream: true`, so you should not set it. */
  stream?: never
  tools?: ExecutableTool[]
}

type NoNull<T> = {
  [P in keyof T]: T[P] extends null ? Exclude<T[P], null> : T[P];
}

type NoNullCreateResponseBody = NoNull<CreateResponseBody>
