import type { CreateResponseBody, ItemParam } from '../generated'

export interface OpenResponsesOptions extends Omit<NoNullCreateResponseBody, 'input'> {
  input: ItemParam[] | string
}

type NoNull<T> = {
  [P in keyof T]: T[P] extends null ? Exclude<T[P], null> : T[P];
}

type NoNullCreateResponseBody = NoNull<CreateResponseBody>
