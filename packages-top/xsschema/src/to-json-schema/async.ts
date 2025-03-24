import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { JSONSchema7 } from 'json-schema'

import { getToJsonSchemaFn } from './vendors'

/**
 * Converts a Standard Schema to a JSON schema.
 *
 * @note This method is `async` because it has to `await import` the schema vendor's dependencies.
 */
export const toJsonSchema = async (schema: StandardSchemaV1): Promise<JSONSchema7> =>
  getToJsonSchemaFn(schema['~standard'].vendor)
    .then(async toJsonSchema => toJsonSchema(schema))
