import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { JSONSchema7 } from 'json-schema'

import type { ToJsonSchemaFn } from './vendors'

import { getToJsonSchemaFn } from './vendors'

const ToJsonSchemaVendors = new Map<string, ToJsonSchemaFn>()

/** @experimental */
export const initToJsonSchemaSyncVendor = async (vendor: string) =>
  getToJsonSchemaFn(vendor)
    .then(fn => ToJsonSchemaVendors.set(vendor, fn))

/** @experimental */
export const toJsonSchemaSync = (schema: StandardSchemaV1): JSONSchema7 => {
  const { vendor } = schema['~standard']
  const toJsonSchema = ToJsonSchemaVendors.get(vendor)

  if (!toJsonSchema)
    throw new Error(`xsschema: Unregistered or unsupported schema vendor "${vendor}". Make sure to register the vendor using "await initToJsonSchemaSyncVendor('${vendor}')" before calling toJsonSchemaSync.`)

  const result = toJsonSchema(schema)

  if (result instanceof Promise)
    throw new Error('xsschema: Function returns a Promise. you need to use toJsonSchema instead of toJsonSchemaSync.')

  return result
}
