import type { JSONSchema7 } from 'json-schema'

export const toJsonSchema = async () => {
  try {
    const { zodToJsonSchema } = await import('zod-to-json-schema')
    // eslint-disable-next-line @masknet/type-prefer-return-type-annotation
    return zodToJsonSchema as (schema: unknown) => JSONSchema7
  }
  catch {
    throw new Error('xsschema: Missing dependencies "zod-to-json-schema"')
  }
}
