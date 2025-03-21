import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { JSONSchema7 } from 'json-schema'
import type { BaseIssue, BaseSchema } from 'valibot'

import { toJsonSchema as toJsonSchemaImpl } from '@valibot/to-json-schema'

export const toJsonSchema = (schema: StandardSchemaV1): JSONSchema7 => {
  return toJsonSchemaImpl(schema as BaseSchema<unknown, unknown, BaseIssue<unknown>>)
}
