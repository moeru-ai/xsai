import type { Input } from '../types/input'

export const normalizeInput = (input: Input[] | string): Input[] =>
  Array.isArray(input)
    ? input
    : [{
        content: input,
        role: 'user',
        type: 'message',
      }]
