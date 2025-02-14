import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { JSONSchema7 } from 'json-schema'

/** @see {@link https://github.com/decs/typeschema/blob/a5c728db9f4f1355a1df04d73091531862084a5e/packages/core/src/utils.ts#L11-L24} */
const memoize = <T>(fn: () => Promise<T>) => {
  let cache: T | undefined

  return async () => {
    if (cache === undefined)
      cache = await fn()

    return cache
  }
}

const importValibotToJsonSchema = memoize(async () => {
  const { toJsonSchema } = await import('./valibot')
  return toJsonSchema
})

const importZodToJsonSchema = memoize(async () => {
  const { toJsonSchema } = await import('./zod')
  return toJsonSchema
})

export const toJsonSchema = async (schema: StandardSchemaV1): Promise<JSONSchema7> => {
  switch (schema['~standard'].vendor) {
    case 'valibot':
      // eslint-disable-next-line ts/no-unsafe-argument
      return (await importValibotToJsonSchema())(schema as any)
    case 'zod':
      // eslint-disable-next-line ts/no-unsafe-argument, @masknet/type-prefer-return-type-annotation
      return (await importZodToJsonSchema())(schema as any) as JSONSchema7
    default:
      throw new Error(`xsschema: Unsupported schema vendor ${schema['~standard'].vendor}`)
  }
}
