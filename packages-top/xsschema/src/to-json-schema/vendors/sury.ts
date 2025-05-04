import type { Schema } from 'sury'

import { toJSONSchema } from 'sury'

import type { ToJsonSchemaFn } from '.'

export const getToJsonSchemaFn = async (): Promise<ToJsonSchemaFn> =>
  schema => toJSONSchema((schema as Schema<unknown>))
