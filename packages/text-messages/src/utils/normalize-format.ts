import type { Format } from '@xsai/text-primitives'

import type { MessagesOutputFormat } from '../types'

import { resolveSchema } from '@xsai/text-primitives'
import { strictJsonSchema } from 'xsschema'

/** @internal */
export const normalizeFormat = (format: Format | undefined): MessagesOutputFormat | undefined =>
  format == null
    ? undefined
    : {
        schema: strictJsonSchema(resolveSchema(format).schema) as Record<string, unknown>,
        type: 'json_schema',
      }
