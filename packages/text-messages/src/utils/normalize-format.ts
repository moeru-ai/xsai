import type { Format } from '@xsai/text-primitives'

import type { MessagesOutputFormat } from '../types'

import { resolveSchema } from '@xsai/text-primitives'

/** @internal */
export const normalizeFormat = (format: Format | undefined): MessagesOutputFormat | undefined =>
  format == null
    ? undefined
    : {
        schema: resolveSchema(format).schema as Record<string, unknown>,
        type: 'json_schema',
      }
