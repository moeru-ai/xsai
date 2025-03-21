import type { JSONSchema7 } from 'json-schema'

export const toJsonSchema = async () => {
  try {
    const { JSONSchema } = await import('effect')
    // eslint-disable-next-line @masknet/type-prefer-return-type-annotation
    return JSONSchema.make as (schema: unknown) => JSONSchema7
  }
  catch {
    throw new Error('xsschema: Missing dependencies "effect"')
  }
}
