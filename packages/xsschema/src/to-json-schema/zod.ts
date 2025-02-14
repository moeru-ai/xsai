export const toJsonSchema = async () => {
  try {
    const { zodToJsonSchema } = await import('zod-to-json-schema')
    return zodToJsonSchema
  }
  catch {
    throw new Error('xsschema: Missing dependencies "zod-to-json-schema"')
  }
}
