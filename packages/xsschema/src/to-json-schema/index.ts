import type { StandardSchemaV1 } from '@standard-schema/spec'

export const toJsonSchema = async (schema: StandardSchemaV1) => {
  switch (schema['~standard'].vendor) {
    case 'valibot':
      // eslint-disable-next-line ts/no-unsafe-argument
      return (await import('./valibot')).toJsonSchema(schema as any)
    case 'zod':
      // eslint-disable-next-line ts/no-unsafe-argument
      return (await import('./zod')).toJsonSchema(schema as any)
  }
}
