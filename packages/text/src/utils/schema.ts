import type { StandardJSONSchemaV1, StandardSchemaV1, StandardTypedV1 } from '@standard-schema/spec'
import type { JSONSchema7 } from 'json-schema'

export type { JSONSchema7, JSONSchema7Definition } from 'json-schema'

export interface CombinedStandardSchema<Input = unknown, Output = Input> {
  readonly '~standard':
    & Partial<StandardSchemaV1.Props<Input, Output>>
    & StandardJSONSchemaV1.Props<Input, Output>
}

export type InferSchemaInput<Schema extends UnresolvedSchema>
  = Schema extends StandardTypedV1 ? StandardSchemaV1.InferInput<Schema> : unknown

export type InferSchemaOutput<Schema extends UnresolvedSchema>
  = Schema extends StandardTypedV1 ? StandardSchemaV1.InferOutput<Schema> : unknown

export interface ResolvedSchema<Input = unknown, Output = Input> {
  schema: JSONSchema7
  validate?: StandardSchemaV1.Props<Input, Output>['validate']
}

export type UnresolvedSchema<Input = unknown, Output = Input>
  = CombinedStandardSchema<Input, Output> | JSONSchema7

export const resolveSchema = <Input = unknown, Output = Input>(schema: UnresolvedSchema<Input, Output>): ResolvedSchema<Input, Output> =>
  '~standard' in schema
    ? {
        schema: schema['~standard'].jsonSchema.input({ target: 'draft-07' }),
        validate: schema['~standard'].validate,
      }
    : { schema }
