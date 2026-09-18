import type { StandardJSONSchemaV1, StandardSchemaV1 } from '@standard-schema/spec'
import type { JSONSchema7, JSONSchema7Definition } from 'json-schema'

export interface CombinedStandardSchema<Input = unknown, Output = Input> {
  readonly '~standard':
    & Partial<StandardSchemaV1.Props<Input, Output>>
    & StandardJSONSchemaV1.Props<Input, Output>
}

export type InferSchemaInput<Schema extends UnresolvedSchema>
  = Schema extends CombinedStandardSchema<infer Input, infer _Output> ? Input : unknown

export interface ResolvedSchema<Input = unknown, Output = Input> {
  schema: JSONSchema7
  validate?: StandardSchemaV1.Props<Input, Output>['validate']
}

export type UnresolvedSchema<Input = unknown, Output = Input>
  = CombinedStandardSchema<Input, Output> | Record<string, unknown>

const NUMERIC_CONSTRAINTS = ['exclusiveMaximum', 'exclusiveMinimum', 'maximum', 'minimum', 'multipleOf'] as const

// Enforce strict object schemas and remove unsupported numeric constraints.
const strictObjectKeywords = (schema: JSONSchema7): void => {
  if (schema.type === 'object' || schema.properties != null) {
    schema.properties ??= {}
    schema.additionalProperties ??= false
  }
  if (schema.properties != null)
    schema.required = Object.keys(schema.properties)
  // Anthropic does not support numerical constraints on integer/number schemas.
  if (schema.type === 'integer' || schema.type === 'number') {
    for (const key of NUMERIC_CONSTRAINTS)
      delete schema[key]
  }
}

// Providers use anyOf instead of oneOf.
const mergeOneOf = (schema: JSONSchema7): void => {
  if (schema.oneOf == null)
    return
  const oneOf = schema.oneOf
  delete schema.oneOf
  schema.anyOf = schema.anyOf == null ? oneOf : schema.anyOf.concat(oneOf)
}

const subschemas = (schema: JSONSchema7): JSONSchema7Definition[] => [
  ...Object.values(schema.$defs ?? {}),
  ...Object.values(schema.properties ?? {}),
  ...(schema.items == null ? [] : Array.isArray(schema.items) ? schema.items : [schema.items]),
  ...(schema.anyOf ?? []),
  ...(schema.allOf ?? []),
]

/** @internal */
export const strictSchema = (schema: JSONSchema7): JSONSchema7 => {
  // OpenAI does not allow keywords next to `$ref`.
  if (schema.$ref != null) {
    for (const key of Object.keys(schema)) {
      if (key !== '$ref')
        delete schema[key as keyof JSONSchema7]
    }
    return schema
  }

  strictObjectKeywords(schema)
  mergeOneOf(schema)
  for (const sub of subschemas(schema)) {
    if (typeof sub !== 'boolean')
      strictSchema(sub)
  }

  return schema
}

const isStandardJsonSchema = <Input, Output>(schema: UnresolvedSchema<Input, Output>): schema is CombinedStandardSchema<Input, Output> =>
  '~standard' in schema && 'jsonSchema' in (schema as StandardJSONSchemaV1)['~standard']

export const resolveSchema = <Input = unknown, Output = Input>(schema: UnresolvedSchema<Input, Output>): ResolvedSchema<Input, Output> =>
  isStandardJsonSchema(schema)
    ? {
        schema: strictSchema(schema['~standard'].jsonSchema.input({ target: 'draft-07' })),
        validate: schema['~standard'].validate,
      }
    : { schema: strictSchema(schema) }

// OpenAI restricts `json_schema.name` to a-zA-Z0-9_- with a max length of 64.
export const toFormatName = (title: unknown): string =>
  (typeof title === 'string' && title.replace(/[^\w-]/g, '_').slice(0, 64)) || 'output'
