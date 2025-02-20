import type { StandardSchemaV1 } from '@standard-schema/spec'

export const validate = async <T extends StandardSchemaV1>(schema: T, input: StandardSchemaV1.InferInput<T>): Promise<StandardSchemaV1.InferOutput<T>> => {
  let result = schema['~standard'].validate(input)
  if (result instanceof Promise)
    result = await result

  if (result.issues) {
    throw new Error(JSON.stringify(result.issues, null, 2))
  }

  // eslint-disable-next-line @masknet/type-prefer-return-type-annotation
  return result.value as StandardSchemaV1.InferOutput<T>
}
