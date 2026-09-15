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
  /** The JSON Schema produced by the source (converter output, or the raw object as-is). */
  schema: JSONSchema7
  /** Present only when the source carried a `StandardSchemaV1` validator. */
  validate?: StandardSchemaV1.Props<Input, Output>['validate']
}

export interface ResolveSchemaOptions {
  /** Which converter side to use: `input` for model-facing schemas (default), `output` for execution-result schemas. */
  direction?: 'input' | 'output'
}

/** Schema as callers supply it: raw JSON Schema or a {@link CombinedStandardSchema}. */
export type UnresolvedSchema<Input = unknown, Output = Input>
  = CombinedStandardSchema<Input, Output> | Record<string, unknown>

// `in` alone is not enough: a raw schema may carry a meaningless `~standard` field.
const isStandardJsonSchema = <Input, Output>(schema: UnresolvedSchema<Input, Output>): schema is CombinedStandardSchema<Input, Output> =>
  '~standard' in schema
  && typeof (schema['~standard'] as { jsonSchema?: { input?: unknown } })?.jsonSchema?.input === 'function'

export const resolveSchema = <Input = unknown, Output = Input>(schema: UnresolvedSchema<Input, Output>, options?: ResolveSchemaOptions): ResolvedSchema<Input, Output> =>
  isStandardJsonSchema(schema)
    ? {
        schema: schema['~standard'].jsonSchema[options?.direction ?? 'input']({ target: 'draft-07' }),
        validate: schema['~standard'].validate,
      }
    : { schema }

// OpenAI restricts `json_schema.name` to a-zA-Z0-9_- with a max length of 64.
export const toFormatName = (title: unknown): string =>
  (typeof title === 'string' && title.replace(/[^\w-]/g, '_').slice(0, 64)) || 'output'
