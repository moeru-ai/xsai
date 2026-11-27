export type DeepPartial<T> = T extends unknown[]
  ? T
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/** Merges objects deeply. Arrays and other values replace; `undefined` removes the field. */
export const merge = <T>(base: T, patch: DeepPartial<T> | undefined): T => {
  if (patch === undefined || !isPlainObject(base) || !isPlainObject(patch))
    return (patch ?? base) as T

  const result: Record<string, unknown> = { ...base }
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined)
      delete result[key]
    else
      result[key] = merge(result[key], value as DeepPartial<unknown>)
  }
  return result as T
}
