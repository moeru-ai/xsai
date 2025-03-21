import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { JSONSchema7 } from 'json-schema'
import type { ZodSchema } from 'zod'

import zodToJsonSchemaImpl from 'zod-to-json-schema'

export const toJsonSchema = (schema: StandardSchemaV1): JSONSchema7 => {
  // eslint-disable-next-line @masknet/type-prefer-return-type-annotation
  return zodToJsonSchemaImpl(schema as ZodSchema<any>) as JSONSchema7
}
