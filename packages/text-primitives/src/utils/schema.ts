import type { StandardJSONSchemaV1, StandardSchemaV1 } from '@standard-schema/spec'
import type { JSONSchema7, JSONSchema7Definition } from 'json-schema'

/** A `StandardJSONSchemaV1` that may also carry a `StandardSchemaV1` validator on the same object. */
export interface CombinedStandardSchema<Input = unknown, Output = Input> {
  readonly '~standard':
    & Partial<StandardSchemaV1.Props<Input, Output>>
    & StandardJSONSchemaV1.Props<Input, Output>
}

/** The handler-facing input type of an {@link UnresolvedSchema}; `unknown` for a raw JSON Schema. */
export type InferSchemaInput<Schema extends UnresolvedSchema>
  = Schema extends CombinedStandardSchema<infer Input, infer _Output> ? Input : unknown

export interface ResolvedSchema<Input = unknown, Output = Input> {
  /** The strict JSON Schema produced by the source (converter output, or the raw object sanitized in place). */
  schema: JSONSchema7
  /** Present only when the source carried a `StandardSchemaV1` validator. */
  validate?: StandardSchemaV1.Props<Input, Output>['validate']
}

/** Schema as callers supply it: raw JSON Schema or a {@link CombinedStandardSchema}. */
export type UnresolvedSchema<Input = unknown, Output = Input>
  = CombinedStandardSchema<Input, Output> | Record<string, unknown>

const NUMERIC_CONSTRAINTS = ['exclusiveMaximum', 'exclusiveMinimum', 'maximum', 'minimum', 'multipleOf'] as const

// `additionalProperties: false` and all-`required` on object schemas, with
// `properties` injected even when empty.
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

// Neither provider supports oneOf; convert to anyOf, merging into an existing anyOf array if present.
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

/**
 * Strict `schema` in place to the subset every wire accepts, and return it.
 * The input is assumed to have no other use.
 *
 * @internal
 */
export const strictSchema = (schema: JSONSchema7): JSONSchema7 => {
  // OpenAI does not allow sibling keywords next to `$ref`.
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

// `in` alone is not enough: a raw schema may carry a meaningless `~standard` field.
const isStandardJsonSchema = <Input, Output>(schema: UnresolvedSchema<Input, Output>): schema is CombinedStandardSchema<Input, Output> =>
  '~standard' in schema
  && typeof (schema['~standard'] as { jsonSchema?: { input?: unknown } })?.jsonSchema?.input === 'function'

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
