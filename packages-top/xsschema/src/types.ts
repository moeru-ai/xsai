import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { JSONSchema7 } from 'json-schema'

export type { StandardSchemaV1 as Schema } from '@standard-schema/spec'
export type { JSONSchema7 as JSONSchema } from 'json-schema'

export type Infer<T extends StandardSchemaV1> = StandardSchemaV1.InferOutput<T>
export type InferIn<T extends StandardSchemaV1> = StandardSchemaV1.InferInput<T>

export type StandardSchemaToJsonSchemaFunction = (schema: StandardSchemaV1) => JSONSchema7

export type StandardSchemaVendor = 'arktype' | 'effect' | 'valibot' | 'zod'
