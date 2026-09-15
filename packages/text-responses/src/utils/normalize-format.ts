import type { Format } from '@xsai/text-primitives'

import type { TextParam } from '../generated'

import { resolveSchema, toFormatName } from '@xsai/text-primitives'
import { strictJsonSchema } from 'xsschema'

/** @internal */
export const normalizeFormat = (format: Format | undefined): TextParam | undefined => {
  if (format == null)
    return undefined

  const schema = strictJsonSchema(resolveSchema(format).schema)
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
