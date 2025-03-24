import type { BaseIssue, BaseSchema } from 'valibot'

import type { ToJsonSchemaFn } from '.'

import { tryImport } from '.'

export const getToJsonSchemaFn = async (): Promise<ToJsonSchemaFn> => {
  const { toJsonSchema } = await tryImport(import('@valibot/to-json-schema'), '@valibot/to-json-schema')
  return schema => toJsonSchema(schema as BaseSchema<unknown, unknown, BaseIssue<unknown>>)
}
