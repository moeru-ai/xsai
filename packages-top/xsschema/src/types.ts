import type { StandardSchemaV1 } from '@standard-schema/spec'

export type { StandardSchemaV1 as Schema } from '@standard-schema/spec'
export type { JSONSchema7 as JsonSchema } from 'json-schema'

/** @deprecated - use `Schema.InferOutput` instead. */
export type Infer<T extends StandardSchemaV1> = StandardSchemaV1.InferOutput<T>
/** @deprecated - use `Schema.InferInput` instead. */
export type InferIn<T extends StandardSchemaV1> = StandardSchemaV1.InferInput<T>
