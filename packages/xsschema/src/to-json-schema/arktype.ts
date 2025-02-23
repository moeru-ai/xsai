import type { Type } from 'arktype'
import type { JSONSchema7 } from 'json-schema'

export const toJsonSchema = async () => {
  const toJsonSchema = (schema: unknown) =>
    (schema as Type).toJsonSchema()

  // eslint-disable-next-line @masknet/type-prefer-return-type-annotation
  return toJsonSchema as (schema: unknown) => JSONSchema7
}
