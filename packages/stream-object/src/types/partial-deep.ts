export type PartialDeep<T>
  = T extends readonly (infer U)[]
    ? readonly PartialDeep<U>[]
    : T extends object
      ? { [K in keyof T]?: PartialDeep<T[K]> }
      : T
