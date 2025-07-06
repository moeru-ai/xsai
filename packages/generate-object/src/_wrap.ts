import type { JsonSchema } from 'xsschema'

export const wrap = (items: JsonSchema): JsonSchema => ({
  properties: {
    elements: {
      items,
      type: 'array',
    },
  },
  required: ['elements'],
  type: 'object',
})
