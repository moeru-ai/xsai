import type { JSONSchema7 } from 'json-schema'

export const toJsonSchema = async () => {
  try {
    const { toJsonSchema } = await import('@valibot/to-json-schema')
    // eslint-disable-next-line @masknet/type-prefer-return-type-annotation
    return toJsonSchema as (schema: unknown) => JSONSchema7
  }
  catch {
    throw new Error('xsschema: Missing dependencies "@valibot/to-json-schema"')
  }
}
