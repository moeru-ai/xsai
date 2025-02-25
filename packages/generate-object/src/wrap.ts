import type { JSONSchema } from 'xsschema'

export const wrap = ({ $schema, ...schema }: JSONSchema): JSONSchema => ({
  properties: {
    elements: {
      items: schema,
      type: 'array',
    },
  },
  required: ['elements'],
  type: 'object',
})
