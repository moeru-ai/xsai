import type { UnionToIntersection } from 'type-fest/source/union-to-intersection'

export const merge = <T extends object[]>(...arr: T): UnionToIntersection<T[number]> =>
  Object.assign(arr[0], ...arr.slice(1)) as UnionToIntersection<T[number]>
