import type { ZodTypeAny } from 'zod/v3'
import type { $ZodType } from 'zod/v4/core'

import type { ToJsonSchemaFn } from '.'

import { missingDependenciesUrl } from '.'

export const getToJsonSchemaFn = async (): Promise<ToJsonSchemaFn> => {
  let zodV4toJSONSchema: ToJsonSchemaFn = (_schema: unknown) => {
    throw new Error(`xsschema: Missing zod v4 dependencies "zod". see ${missingDependenciesUrl}`)
  }
  let zodV3ToJSONSchema: ToJsonSchemaFn = (_schema: unknown) => {
    throw new Error(`xsschema: Missing zod v3 dependencies "zod-to-json-schema". see ${missingDependenciesUrl}`)
  }

  try {
    // https://zod.dev/library-authors?id=how-to-support-zod-and-zod-mini-simultaneously#how-to-support-zod-and-zod-mini-simultaneously
    const { toJSONSchema } = await import('zod/v4/core')
    // Zod v4 defaults to Draft 2020-12, but we need Draft 07
    zodV4toJSONSchema = ((schema: unknown) => toJSONSchema(schema as $ZodType, { target: 'draft-7' })) as ToJsonSchemaFn
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
    // https://zod.dev/library-authors?id=how-to-support-zod-and-zod-mini-simultaneously#how-to-support-zod-3-and-zod-4-simultaneously
    if ('_zod' in (schema as $ZodType | ZodTypeAny))
      return zodV4toJSONSchema(schema)
    else
      return zodV3ToJSONSchema(schema)
  }
}
