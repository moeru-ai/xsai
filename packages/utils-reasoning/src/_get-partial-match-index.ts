/**
 * Finds the index where a full or partial match occurs between two strings.
 *
 * This function first checks if `matchText` is a substring of `text`. If it is,
 * the function returns the starting index of that match.
 *
 * If no complete match is found, it checks for a partial match where the end of `text`
 * matches the beginning of `matchText` (like a potential continuation). It returns
 * the index where this partial match begins.
 *
 * @param text - The source string to search within
 * @param matchText - The string to find either completely or partially
 * @returns The index position where a match or partial match begins, or -1 if no match is found
 *
 * @example
 * // Full match
 * getPartialMatchIndex("hello world", "world") // returns 6
 *
 * @example
 * // Partial match
 * getPartialMatchIndex("hel", "hello") // returns 0 (end of "hel" matches start of "hello")
 *
 * @example
 * // No match
 * getPartialMatchIndex("abc", "xyz") // returns -1
 */
export const getPartialMatchIndex = (text: string, matchText: string): number => {
  if (text.length === 0 || matchText.length === 0) {
    return -1
  }

  const matchIndex = text.indexOf(matchText)
  if (matchIndex !== -1) {
    return matchIndex
  }

  // Check for partial matches
  for (let i = Math.max(text.length - matchText.length + 1, 0); i < text.length; i++) {
    if (matchText.startsWith(text.slice(i))) {
      return i
    }
  }

  return -1
}
