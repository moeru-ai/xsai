import type { ZodType } from 'zod4'
import type { ZodSchema } from 'zod'

import type { ToJsonSchemaFn } from '.'

export const getToJsonSchemaFn = async (): Promise<ToJsonSchemaFn> => {
  let toJSONSchema: ToJsonSchemaFn = (_schema: unknown) => {
    throw new Error('xsschema: Missing dependencies "zod" or "@zod/mini".')
  }
  let zodToJSONSchema: ToJsonSchemaFn = (_schema: unknown) => {
    throw new Error('xsschema: Missing dependencies "zod-to-json-schema".')
  }

  try {
    const { z } = await import('@zod/mini')
    toJSONSchema = z.toJSONSchema as ToJsonSchemaFn
  }
  catch {}

  try {
    const { z } = await import('zod')
    if ('toJSONSchema' in z)
      toJSONSchema = z.toJSONSchema as ToJsonSchemaFn
  }
  catch (err) {
    if (err instanceof Error)
      console.error(err.message)
  }

  try {
    const { zodToJsonSchema } = await import('zod-to-json-schema')
    zodToJSONSchema = zodToJsonSchema as ToJsonSchemaFn
  }
  catch (err) {
    if (err instanceof Error)
      console.error(err.message)
  }

  return async (schema: unknown) => {
    if ('_zod' in (schema as ZodSchema | ZodType))
      return toJSONSchema(schema)
    else
      return zodToJSONSchema(schema)
  }
}
