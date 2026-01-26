import type { CreateResponseBody, ItemParam, UserMessageItemParam } from '../generated/types.gen'

export const normalizeInput = (input: NonNullable<CreateResponseBody['input']>): ItemParam[] =>
  Array.isArray(input)
    ? input
    : [{
      content: input,
      role: 'user',
      type: 'message',
    } satisfies UserMessageItemParam]
