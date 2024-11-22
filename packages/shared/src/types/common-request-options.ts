export interface CommonRequestOptions<T extends string> {
  /** @default `http://localhost:11434/v1` */
  base?: string
  /** @default `undefined` */
  headers?: Headers | Record<string, string>
  path?: ({} & string) | T
}