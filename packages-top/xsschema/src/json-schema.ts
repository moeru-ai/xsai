import type { JsonSchema } from './types'

export const jsonSchema = (schema: JsonSchema) => schema

export const strictJsonSchema = (schema: JsonSchema): JsonSchema => ({
  ...schema,
  additionalProperties: false,
  properties: schema.properties
    ? Object.fromEntries(
        Object.entries(schema.properties)
          .map(([k, v]) => [
            k,
            typeof v === 'object' && 'type' in v && v.type === 'object'
              ? strictJsonSchema(v)
              : v,
          ]),
      )
    : schema.properties,
})
