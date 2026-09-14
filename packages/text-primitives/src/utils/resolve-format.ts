import type { StandardJSONSchemaV1 } from '@standard-schema/spec'

import type { Format } from '../core'

import { strictJsonSchema } from 'xsschema'

/** `format` normalized for the wire. @internal */
export interface ResolvedFormat {
  description?: string
  name: string
  schema: Record<string, unknown>
}

// OpenAI restricts `json_schema.name` to a-zA-Z0-9_- with a max length of 64.
const toFormatName = (title: unknown): string =>
  (typeof title === 'string' && title.replace(/[^\w-]/g, '_').slice(0, 64)) || 'output'

/** @internal */
export const resolveFormat = (format: Format | undefined): ResolvedFormat | undefined => {
  if (format == null)
    return undefined

  const schema = '~standard' in format
    ? (format as StandardJSONSchemaV1)['~standard'].jsonSchema.input({ target: 'draft-07' })
    : format

  return {
    description: schema.description as string | undefined,
    name: toFormatName(schema.title),
    schema: strictJsonSchema(schema) as Record<string, unknown>,
  }
}
