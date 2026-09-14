import type { Format } from '@xsai/text-primitives'

import type { MessagesOutputFormat } from '../types'

import { resolveFormat } from '@xsai/text-primitives'

/** @internal */
export const normalizeFormat = (format: Format | undefined): MessagesOutputFormat | undefined => {
  const resolved = resolveFormat(format)
  return resolved == null
    ? undefined
    : { schema: resolved.schema, type: 'json_schema' }
}
