import type { JSONSchema } from 'xsschema'

export const wrapArray = (schema: JSONSchema): JSONSchema => {
  return {
    items: schema,
    type: 'array',
  }
}

export const wrapObject = (schema: JSONSchema, name: string): JSONSchema => {
  return {
    properties: {
      [name]: schema,
    },
    required: [name],
    type: 'object',
  }
}
