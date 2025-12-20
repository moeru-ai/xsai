import type { StandardJSONSchemaV1, StandardSchemaV1 } from '@standard-schema/spec'

export const isStandardJSONSchemaV1 = (schema: StandardSchemaV1): schema is StandardJSONSchemaV1 & StandardSchemaV1 =>
  'jsonSchema' in schema['~standard']
