import type { CreateResponseBody, ItemParam } from '../generated'
import type { ExecutableTool } from '../utils/tool'

export interface OpenResponsesOptions extends Omit<NoNullCreateResponseBody, 'input' | 'tools'> {
  input: ItemParam[] | string
  tools?: ExecutableTool[]
}

type NoNull<T> = {
  [P in keyof T]: T[P] extends null ? Exclude<T[P], null> : T[P];
}

type NoNullCreateResponseBody = NoNull<CreateResponseBody>
