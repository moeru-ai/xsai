import type { UnresolvedSchema } from '@xsai/text-primitives'

import type { TextParam } from '../generated'

import { resolveSchema, toFormatName } from '@xsai/text-primitives'

import { normalizeSchema } from './normalize-schema'

/** @internal */
export const normalizeFormat = (outputFormat: undefined | UnresolvedSchema): TextParam | undefined => {
  if (outputFormat == null)
    return undefined

  const { schema } = resolveSchema(outputFormat)
  const normalized = normalizeSchema(schema)
  return {
    format: {
      description: normalized.description,
      name: toFormatName(normalized.title),
      schema: normalized as Record<string, unknown>,
      strict: true,
      type: 'json_schema',
    },
  }
}
