import type { Type } from 'arktype'
import type { JSONSchema7 } from 'json-schema'

import type { ToJsonSchemaFn } from '.'

export const getToJsonSchemaFn = async (): Promise<ToJsonSchemaFn> =>
  schema => (schema as Type).toJsonSchema() as JSONSchema7
