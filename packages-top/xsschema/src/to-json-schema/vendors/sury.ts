import type { Schema } from 'sury'

import type { ToJsonSchemaFn } from '.'

import { tryImport } from '.'

export const getToJsonSchemaFn = async (): Promise<ToJsonSchemaFn> => {
  const { toJSONSchema } = await tryImport(import('sury'), 'sury')
  return schema => toJSONSchema((schema as Schema<unknown>))
}
