export const toJsonSchema = async () => {
  try {
    const { toJsonSchema } = await import('@valibot/to-json-schema')
    return toJsonSchema
  }
  catch {
    throw new Error('xsschema: Missing dependencies "@valibot/to-json-schema"')
  }
}
