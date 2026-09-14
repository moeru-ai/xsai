import type { Format } from '@xsai/text-primitives'

import type { TextParam } from '../generated'

import { resolveFormat } from '@xsai/text-primitives'

/** @internal */
export const normalizeFormat = (format: Format | undefined): TextParam | undefined => {
  const resolved = resolveFormat(format)
  return resolved == null
    ? undefined
    : {
        format: {
          description: resolved.description,
          name: resolved.name,
          schema: resolved.schema,
          strict: true,
          type: 'json_schema',
        },
      }
}
