import type { UnresolvedSchema } from '@xsai/text-primitives'

import type { TextParam } from '../generated'

import { resolveSchema, toFormatName } from '@xsai/text-primitives'

/** @internal */
export const normalizeFormat = (outputFormat: undefined | UnresolvedSchema): TextParam | undefined => {
  if (outputFormat == null)
    return undefined

  const { schema } = resolveSchema(outputFormat)
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
