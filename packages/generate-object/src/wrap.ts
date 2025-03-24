import type { JsonSchema } from 'xsschema'

export const wrap = ({ $schema, ...schema }: JsonSchema): JsonSchema => ({
  properties: {
    elements: {
      items: schema,
      type: 'array',
    },
  },
  required: ['elements'],
  type: 'object',
})
