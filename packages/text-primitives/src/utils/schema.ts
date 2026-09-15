import type { StandardJSONSchemaV1, StandardSchemaV1 } from '@standard-schema/spec'
import type { JSONSchema7 } from 'json-schema'

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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value != null && typeof value === 'object' && !Array.isArray(value)

const NUMERIC_CONSTRAINTS = ['exclusiveMaximum', 'exclusiveMinimum', 'maximum', 'minimum', 'multipleOf']

// `additionalProperties: false` and all-`required` on object schemas, with
// `properties` injected even when empty.
const strictObjectKeywords = (obj: Record<string, unknown>): void => {
  if (obj.type === 'object' || 'properties' in obj) {
    if (!('properties' in obj))
      obj.properties = {}
    if (!('additionalProperties' in obj))
      obj.additionalProperties = false
  }
  if (isRecord(obj.properties))
    obj.required = Object.keys(obj.properties)
  // Anthropic does not support numerical constraints on integer/number schemas.
  if (obj.type === 'integer' || obj.type === 'number') {
    for (const key of NUMERIC_CONSTRAINTS)
      delete obj[key]
  }
}

// Neither provider supports oneOf; convert to anyOf, merging into an existing anyOf array if present.
const mergeOneOf = (obj: Record<string, unknown>): void => {
  if (!('oneOf' in obj))
    return
  const oneOf = obj.oneOf
  delete obj.oneOf
  const anyOf = obj.anyOf
  obj.anyOf = Array.isArray(anyOf) && Array.isArray(oneOf)
    ? (anyOf as unknown[]).concat(oneOf as unknown[])
    : oneOf
}

const subschemas = (obj: Record<string, unknown>): unknown[] => {
  const subs: unknown[] = []
  if (isRecord(obj.$defs))
    subs.push(...Object.values(obj.$defs))
  if (isRecord(obj.properties))
    subs.push(...Object.values(obj.properties))
  if (obj.items != null)
    subs.push(obj.items)
  for (const key of ['anyOf', 'allOf'] as const) {
    if (Array.isArray(obj[key]))
      subs.push(...obj[key] as unknown[])
  }
  return subs
}

/**
 * Strict `schema` in place to the subset every wire accepts, and return it.
 * The input is assumed to have no other use.
 *
 * @internal
 */
export const strictSchema = <T>(schema: T): T => {
  if (!isRecord(schema))
    return schema

  // OpenAI does not allow sibling keywords next to `$ref`.
  if ('$ref' in schema) {
    for (const key of Object.keys(schema)) {
      if (key !== '$ref')
        delete schema[key]
    }
    return schema
  }

  strictObjectKeywords(schema)
  mergeOneOf(schema)
  for (const sub of subschemas(schema))
    strictSchema(sub)

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
