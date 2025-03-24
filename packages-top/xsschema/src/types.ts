import type { StandardSchemaV1 } from '@standard-schema/spec'

export type { StandardSchemaV1 as Schema } from '@standard-schema/spec'
export type { JSONSchema7 as JsonSchema } from 'json-schema'

export type Infer<T extends StandardSchemaV1> = StandardSchemaV1.InferOutput<T>
export type InferIn<T extends StandardSchemaV1> = StandardSchemaV1.InferInput<T>
