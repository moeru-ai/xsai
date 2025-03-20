import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { Schema } from 'effect'
import type { JSONSchema7 } from 'json-schema'

import { JSONSchema } from 'effect'

export const toJsonSchema = (schema: StandardSchemaV1): JSONSchema7 =>
  // eslint-disable-next-line @masknet/type-no-force-cast-via-top-type
  JSONSchema.make(schema as unknown as Schema.Schema<any, any, any>) as JSONSchema7
