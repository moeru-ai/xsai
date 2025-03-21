import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { JSONSchema7 } from 'json-schema'

export const toJsonSchema = async (schema: StandardSchemaV1): Promise<JSONSchema7> => {
  switch (schema['~standard'].vendor) {
    case 'arktype':
      return (await ((await import('./arktype')).toJsonSchema()))(schema)
    case 'effect':
      return (await ((await import('./effect')).toJsonSchema()))(schema)
    case 'valibot':
      return (await ((await import('./valibot')).toJsonSchema()))(schema)
    case 'zod':
      return (await ((await import('./zod')).toJsonSchema()))(schema)
    default:
      throw new Error(`xsschema: Unsupported schema vendor "${schema['~standard'].vendor}"`)
  }
}
