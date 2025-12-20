import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { JSONSchema7 } from 'json-schema'

import { isStandardJSONSchemaV1 } from '../utils/is-standard-json-schema-v1'
import { getToJsonSchemaFn } from './vendors'

/**
 * Converts a Standard Schema to a JSON schema.
 *
 * @note This method is `async` because it has to `await import` the schema vendor's dependencies.
 */
export const toJsonSchema = async (schema: StandardSchemaV1): Promise<JSONSchema7> =>
  isStandardJSONSchemaV1(schema)
    ? schema['~standard'].jsonSchema.input({ target: 'draft-07' })
    : getToJsonSchemaFn(schema['~standard'].vendor)
        .then(async toJsonSchema => toJsonSchema(schema))
