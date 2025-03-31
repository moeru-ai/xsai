// we don't need to use complex deep equal check for JSON object, so we just
// copy from: https://github.com/vercel/ai/blob/main/packages/ui-utils/src/is-deep-equal-data.ts

/**
 * Performs a deep-equal comparison of two parsed JSON objects.
 *
 * @param {any} obj1 - The first object to compare.
 * @param {any} obj2 - The second object to compare.
 * @returns {boolean} - Returns true if the two objects are deeply equal, false otherwise.
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
export const isDeepEqualData = (obj1: any, obj2: any): boolean => {
  // Check for strict equality first
  if (obj1 === obj2)
    return true

  // Check if either is null or undefined
  if (obj1 == null || obj2 == null)
    return false

  // Check if both are objects
  if (typeof obj1 !== 'object' && typeof obj2 !== 'object')
    return obj1 === obj2

  // If they are not strictly equal, they both need to be Objects
  // eslint-disable-next-line ts/no-unsafe-member-access
  if (obj1.constructor !== obj2.constructor)
    return false

  // Special handling for Date objects
  if (obj1 instanceof Date && obj2 instanceof Date) {
    return obj1.getTime() === obj2.getTime()
  }

  // Handle arrays: compare length and then perform a recursive deep comparison on each item
  if (Array.isArray(obj1)) {
    // eslint-disable-next-line ts/no-unsafe-member-access
    if (obj1.length !== obj2.length)
      return false
    for (let i = 0; i < obj1.length; i++) {
      // eslint-disable-next-line ts/no-unsafe-member-access
      if (!isDeepEqualData(obj1[i], obj2[i]))
        return false
    }
    return true // All array elements matched
  }

  // Compare the set of keys in each object
  // eslint-disable-next-line ts/no-unsafe-argument
  const keys1 = Object.keys(obj1)
  // eslint-disable-next-line ts/no-unsafe-argument
  const keys2 = Object.keys(obj2)
  if (keys1.length !== keys2.length)
    return false

  // Check each key-value pair recursively
  for (const key of keys1) {
    if (!keys2.includes(key))
      return false
    // eslint-disable-next-line ts/no-unsafe-member-access
    if (!isDeepEqualData(obj1[key], obj2[key]))
      return false
  }

  return true // All keys and values matched
}
