import type { ZodSchema } from 'zod'
import type { ZodType } from 'zod/v4'

import type { ToJsonSchemaFn } from '.'

export const getToJsonSchemaFn = async (): Promise<ToJsonSchemaFn> => {
  let zodV4toJSONSchema: ToJsonSchemaFn = (_schema: unknown) => {
    throw new Error('xsschema: Missing zod v4 dependencies "zod" or "@zod/mini".')
  }
  let zodToJSONSchema: ToJsonSchemaFn = (_schema: unknown) => {
    throw new Error('xsschema: Missing zod v3 dependencies "zod-to-json-schema".')
  }

  try {
    const { z } = await import('@zod/mini')
    zodV4toJSONSchema = z.toJSONSchema as ToJsonSchemaFn
  }
  catch {}

  try {
    const { z } = await import('zod')
    if ('toJSONSchema' in z)
      zodToJSONSchema = z.toJSONSchema as ToJsonSchemaFn
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

  try {
    const { z } = await import('zod/v4')
    zodV4toJSONSchema = z.toJSONSchema as ToJsonSchemaFn
  }
  catch (err) {
    if (err instanceof Error)
      console.error(err.message)
  }

  return async (schema: unknown) => {
    if ('_zod' in (schema as ZodSchema | ZodType))
      return zodV4toJSONSchema(schema)
    else
      return zodToJSONSchema(schema)
  }
}
