import type { Format } from '@xsai/text-primitives'

import type { TextParam } from '../generated'

import { resolveSchema, toFormatName } from '@xsai/text-primitives'

/** @internal */
export const normalizeFormat = (format: Format | undefined): TextParam | undefined => {
  if (format == null)
    return undefined

  const { schema } = resolveSchema(format)
  return {
    format: {
      description: schema.description,
      name: toFormatName(schema.title),
      schema: schema as Record<string, unknown>,
      strict: true,
      type: 'json_schema',
    },
  }
}
