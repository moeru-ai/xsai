import type { UnresolvedSchema } from '@xsai/text-primitives'

import type { ChatResponseFormat } from '../types'

import { resolveSchema, toFormatName } from '@xsai/text-primitives'

import { normalizeSchema } from './normalize-schema'

/** @internal */
export const normalizeFormat = (outputFormat: undefined | UnresolvedSchema): ChatResponseFormat | undefined => {
  if (outputFormat == null)
    return undefined

  const { schema } = resolveSchema(outputFormat)
  const normalized = normalizeSchema(schema)
  return {
    json_schema: {
      description: normalized.description,
      name: toFormatName(normalized.title),
      schema: normalized as Record<string, unknown>,
      strict: true,
    },
    type: 'json_schema',
  }
}
