import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { JSONSchema7 } from 'json-schema'

export const toJsonSchema = async (schema: StandardSchemaV1): Promise<JSONSchema7> => {
  switch (schema['~standard'].vendor) {
    case 'valibot':
      return (await ((await import('./valibot')).toJsonSchema()))(schema)
    case 'zod':
      return (await ((await import('./zod')).toJsonSchema()))(schema)
    default:
      throw new Error(`xsschema: Unsupported schema vendor "${schema['~standard'].vendor}"`)
  }
}
