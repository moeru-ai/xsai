import type { StandardSchemaV1 } from '@standard-schema/spec'

export type Infer<T extends StandardSchemaV1> = StandardSchemaV1.InferOutput<T>

export type InferIn<T extends StandardSchemaV1> = StandardSchemaV1.InferInput<T>
