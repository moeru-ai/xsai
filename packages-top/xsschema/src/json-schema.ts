import type { JsonSchema } from './types'

export const jsonSchema = (schema: JsonSchema) => schema

export const strictJsonSchema = (schema: JsonSchema): JsonSchema => ({
  ...schema,
  additionalProperties: false,
})
