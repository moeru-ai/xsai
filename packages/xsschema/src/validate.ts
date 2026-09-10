import type { StandardSchemaV1 } from '@standard-schema/spec'

/** @see {@link https://github.com/standard-schema/standard-schema#how-do-i-accept-standard-schemas-in-my-library} */
export const validate = async <T extends StandardSchemaV1>(schema: T, input: StandardSchemaV1.InferInput<T>): Promise<StandardSchemaV1.InferOutput<T>> => {
  let result = schema['~standard'].validate(input)
  if (result instanceof Promise)
    result = await result

  if (result.issues)
    throw new Error(JSON.stringify(result.issues, null, 2))

  return (result as StandardSchemaV1.SuccessResult<T>).value
}
