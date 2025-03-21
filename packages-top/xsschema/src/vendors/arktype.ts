import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { Type } from 'arktype'
import type { JSONSchema7 } from 'json-schema'

export const toJsonSchema = (schema: StandardSchemaV1): JSONSchema7 =>
  (schema as Type).toJsonSchema() as JSONSchema7
