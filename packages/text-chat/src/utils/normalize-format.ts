import type { Format } from '@xsai/text-primitives'

import type { ChatResponseFormat } from '../types'

import { resolveSchema, toFormatName } from '@xsai/text-primitives'

/** @internal */
export const normalizeFormat = (format: Format | undefined): ChatResponseFormat | undefined => {
  if (format == null)
    return undefined

  const { schema } = resolveSchema(format)
  return {
    json_schema: {
      description: schema.description,
      name: toFormatName(schema.title),
      schema: schema as Record<string, unknown>,
      strict: true,
    },
    type: 'json_schema',
  }
}
