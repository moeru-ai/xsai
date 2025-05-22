import type { ZodTypeAny } from 'zod/v3'
import type { $ZodType } from 'zod/v4/core'

import type { ToJsonSchemaFn } from '.'

export const getToJsonSchemaFn = async (): Promise<ToJsonSchemaFn> => {
  let zodV4toJSONSchema: ToJsonSchemaFn = (_schema: unknown) => {
    throw new Error('xsschema: Missing zod v4 dependencies "zod".')
  }
  let zodV3ToJSONSchema: ToJsonSchemaFn = (_schema: unknown) => {
    throw new Error('xsschema: Missing zod v3 dependencies "zod-to-json-schema".')
  }

  try {
    const { toJSONSchema } = await import('zod/v4/core')
    zodV4toJSONSchema = toJSONSchema as ToJsonSchemaFn
  }
  catch (err) {
    if (err instanceof Error)
      console.error(err.message)
  }

  try {
    const { zodToJsonSchema } = await import('zod-to-json-schema')
    zodV3ToJSONSchema = zodToJsonSchema as ToJsonSchemaFn
  }
  catch (err) {
    if (err instanceof Error)
      console.error(err.message)
  }

  return async (schema: unknown) => {
    if ('_zod' in (schema as $ZodType | ZodTypeAny))
      return zodV4toJSONSchema(schema)
    else
      return zodV3ToJSONSchema(schema)
  }
}
