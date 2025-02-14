/**
 * Clean all undefined values.
 * @param obj object
 * @returns cleaned object
 *
 * @example
 * ```ts
 * import { clean } from '@xsai/shared'
 *
 * // { a: 'a' }
 * const obj = clean({
 *   a: 'a',
 *   b: undefined
 * })
 * ```
 */
export const clean
= <T extends Record<string, undefined | unknown>>
(obj: T) =>
  Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined),
  ) as Record<keyof T, Exclude<T[keyof T], unknown>>
