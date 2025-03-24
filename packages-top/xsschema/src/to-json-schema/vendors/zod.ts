import type { JSONSchema7 } from 'json-schema'
import type { ZodSchema } from 'zod'

import type { ToJsonSchemaFn } from '.'

import { tryImport } from '.'

export const getToJsonSchemaFn = async (): Promise<ToJsonSchemaFn> => {
  const { zodToJsonSchema } = await tryImport(import('zod-to-json-schema'), 'zod-to-json-schema')
  return schema => zodToJsonSchema(schema as ZodSchema<unknown>) as JSONSchema7
}
