import type { JSONSchema7 } from 'json-schema'

export type ToJsonSchemaFn = (schema: unknown) => JSONSchema7 | Promise<JSONSchema7>

export const tryImport = async <T>(result: Promise<T>, name: string): Promise<Awaited<T>> => {
  try {
    return await result
  }
  catch {
    throw new Error(`xsschema: Missing dependencies "${name}".`)
  }
}

export const getToJsonSchemaFn = async (vendor: string): Promise<ToJsonSchemaFn> => {
  switch (vendor) {
    case 'arktype':
      return import('./arktype')
        .then(async ({ getToJsonSchemaFn }) => getToJsonSchemaFn())
    case 'effect':
      return import('./effect')
        .then(async ({ getToJsonSchemaFn }) => getToJsonSchemaFn())
    case 'valibot':
      return import('./valibot')
        .then(async ({ getToJsonSchemaFn }) => getToJsonSchemaFn())
    case 'zod':
      return import('./zod')
        .then(async ({ getToJsonSchemaFn }) => getToJsonSchemaFn())
    default:
      throw new Error(`xsschema: Unsupported schema vendor "${vendor}"`)
  }
}
