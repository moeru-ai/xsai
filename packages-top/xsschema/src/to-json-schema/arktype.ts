import type { Type } from 'arktype'
import type { JSONSchema7 } from 'json-schema'

export const toJsonSchema = async () =>
  (schema: unknown) =>
    (schema as Type).toJsonSchema() as JSONSchema7
