import type { StandardJSONSchemaV1, StandardSchemaV1 } from '@standard-schema/spec'
import type { JSONSchema7 } from 'json-schema'

export type { JSONSchema7, JSONSchema7Definition } from 'json-schema'

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

const isStandardJsonSchema = <Input, Output>(schema: UnresolvedSchema<Input, Output>): schema is CombinedStandardSchema<Input, Output> =>
  '~standard' in schema && 'jsonSchema' in (schema as StandardJSONSchemaV1)['~standard']

export const resolveSchema = <Input = unknown, Output = Input>(schema: UnresolvedSchema<Input, Output>): ResolvedSchema<Input, Output> =>
  isStandardJsonSchema(schema)
    ? {
        schema: schema['~standard'].jsonSchema.input({ target: 'draft-07' }),
        validate: schema['~standard'].validate,
      }
    : { schema }

// OpenAI restricts `json_schema.name` to a-zA-Z0-9_- with a max length of 64.
export const toFormatName = (title: unknown): string =>
  (typeof title === 'string' && title.replace(/[^\w-]/g, '_').slice(0, 64)) || 'output'
