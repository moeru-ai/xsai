export type PartialDeep<T>
  = T extends readonly unknown[]
    ? T
    : T extends object
      ? { [K in keyof T]?: PartialDeep<T[K]> }
      : T
