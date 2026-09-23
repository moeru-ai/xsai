import type { UnresolvedSchema } from '@xsai/text-primitives/internal'

import type { TextParam } from '../generated'

import { resolveSchema } from '@xsai/text-primitives/internal'

import { normalizeSchema } from './normalize-schema'

/** @internal */
export const normalizeSchemaName = (title?: string): string =>
  title == null || title === '' ? 'output' : title.replace(/[^\w-]/g, '_').slice(0, 64)

/** @internal */
export const normalizeFormat = (outputFormat: undefined | UnresolvedSchema): TextParam | undefined => {
  if (outputFormat == null)
    return undefined

  const { schema } = resolveSchema(outputFormat)
  const normalized = normalizeSchema(schema)
  return {
    format: {
      description: normalized.description,
      name: normalizeSchemaName(normalized.title),
      schema: normalized as Record<string, unknown>,
      strict: true,
      type: 'json_schema',
    },
  }
}
