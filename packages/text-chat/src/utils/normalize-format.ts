import type { Format } from '@xsai/text-primitives'

import type { ChatResponseFormat } from '../types'

import { resolveFormat } from '@xsai/text-primitives'

/** @internal */
export const normalizeFormat = (format: Format | undefined): ChatResponseFormat | undefined => {
  const resolved = resolveFormat(format)
  return resolved == null
    ? undefined
    : {
        json_schema: {
          description: resolved.description,
          name: resolved.name,
          schema: resolved.schema,
          strict: true,
        },
        type: 'json_schema',
      }
}
