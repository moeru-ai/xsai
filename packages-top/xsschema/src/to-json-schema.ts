import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { JSONSchema7 } from 'json-schema'

import type { StandardSchemaVendor } from './types'

import { getVendorToJsonSchemaFunction, registerStandardSchemaVendor } from './vendors'

/**
 * Converts a Standard Schema to a JSON schema synchronously.
 *
 * @note Make sure to call `registerStandardSchemaVendor` with the appropriate vendor before calling this function, or you can call `toJsonSchema` instead which is async.
 * @note Currently supported vendors include: `arktype`, `valibot`, and `zod`.
 */
export const toJsonSchemaSync = (schema: StandardSchemaV1): JSONSchema7 => {
  const { vendor } = schema['~standard']
  const toJsonSchema = getVendorToJsonSchemaFunction(vendor as StandardSchemaVendor)
  if (!toJsonSchema) {
    throw new Error(`xsschema: Unregistered or unsupported schema vendor "${vendor}". Make sure to register the vendor using "await registerStandardSchemaVendor('${vendor}')" before calling toJsonSchema.`)
  }

  return toJsonSchema(schema)
}

/**
 * Converts a Standard Schema to a JSON schema.
 *
 * @note This method is `async` because it has to `await import` the schema vendor's dependencies.
 * @note Currently supported vendors include: `arktype`, `valibot`, and `zod`.
 */
export const toJsonSchema = async (schema: StandardSchemaV1): Promise<JSONSchema7> => {
  const { vendor } = schema['~standard']
  await registerStandardSchemaVendor(vendor as StandardSchemaVendor)
  return toJsonSchemaSync(schema)
}
