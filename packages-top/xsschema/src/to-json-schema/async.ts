import type { StandardJSONSchemaV1, StandardSchemaV1 } from '@standard-schema/spec'
import type { JSONSchema7 } from 'json-schema'

import { getToJsonSchemaFn } from './vendors'

/**
 * Converts a Standard Schema to a JSON schema.
 *
 * @note This method is `async` because it has to `await import` the schema vendor's dependencies.
 */
export const toJsonSchema = async (schema: StandardSchemaV1): Promise<JSONSchema7> => {
  // eslint-disable-next-line @masknet/type-no-force-cast-via-top-type
  if ('jsonSchema' in schema['~standard'] && 'input' in (schema as unknown as StandardJSONSchemaV1)['~standard'].jsonSchema) {
    // eslint-disable-next-line @masknet/type-no-force-cast-via-top-type
    return (schema as unknown as StandardJSONSchemaV1)['~standard'].jsonSchema.input({ target: 'draft-07' })
  }
  else {
    const toJsonSchema = await getToJsonSchemaFn(schema['~standard'].vendor)
    return toJsonSchema(schema)
  }
}
