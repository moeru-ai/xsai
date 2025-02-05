import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { JSONSchema7 } from 'json-schema'

export const toJsonSchema = async (schema: StandardSchemaV1): Promise<JSONSchema7> => {
  switch (schema['~standard'].vendor) {
    case 'valibot':
      // eslint-disable-next-line ts/no-unsafe-argument
      return (await import('./valibot')).toJsonSchema(schema as any)
    case 'zod':
      // eslint-disable-next-line ts/no-unsafe-argument, @masknet/type-prefer-return-type-annotation
      return (await import('./zod')).toJsonSchema(schema as any) as JSONSchema7
    default:
      throw new Error(`xsschema: Unsupported schema vendor ${schema['~standard'].vendor}`)
  }
}
