import type { UnresolvedSchema } from '@xsai/text-primitives'

import type { MessagesOutputFormat } from '../types'

import { resolveSchema } from '@xsai/text-primitives'

/** @internal */
export const normalizeFormat = (outputFormat: undefined | UnresolvedSchema): MessagesOutputFormat | undefined =>
  outputFormat == null
    ? undefined
    : {
        schema: resolveSchema(outputFormat).schema as Record<string, unknown>,
        type: 'json_schema',
      }
