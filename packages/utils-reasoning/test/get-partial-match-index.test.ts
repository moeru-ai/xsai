import { describe, expect, it } from 'vitest'

import { getPartialMatchIndex } from '../src/get-partial-match-index'

describe('getPartialMatchIndex', () => {
  it('should find complete match', () => {
    expect(getPartialMatchIndex('hello world', 'world')).toBe(6)
    expect(getPartialMatchIndex('hello world', 'hello')).toBe(0)
    expect(getPartialMatchIndex('abcdefg', 'cde')).toBe(2)
    expect(getPartialMatchIndex('testing123', '123')).toBe(7)
  })

  it('should find partial match when end of text matches start of matchText', () => {
    expect(getPartialMatchIndex('hel', 'hello')).toBe(0)
    expect(getPartialMatchIndex('wor', 'world')).toBe(0)
    expect(getPartialMatchIndex('abc', 'abcdef')).toBe(0)
    expect(getPartialMatchIndex('tes', 'testing')).toBe(0)
  })

  it('should handle partial matches at different positions', () => {
    expect(getPartialMatchIndex('abchel', 'hello')).toBe(3)
    expect(getPartialMatchIndex('xyzabc', 'abcdef')).toBe(3)
    expect(getPartialMatchIndex('123wo', 'world')).toBe(3)
  })

  it('should handle single character matches', () => {
    expect(getPartialMatchIndex('abcd', 'dx')).toBe(3)
    expect(getPartialMatchIndex('xyz', 'zab')).toBe(2)
    expect(getPartialMatchIndex('hello', 'o world')).toBe(4)
  })

  it('should return -1 when no match is found', () => {
    expect(getPartialMatchIndex('abc', 'xyz')).toBe(-1)
    expect(getPartialMatchIndex('hello', 'world')).toBe(-1)
    expect(getPartialMatchIndex('test', 'example')).toBe(-1)
  })

  it('should handle empty strings', () => {
    expect(getPartialMatchIndex('', 'hello')).toBe(-1)
    expect(getPartialMatchIndex('hello', '')).toBe(-1)
    expect(getPartialMatchIndex('', '')).toBe(-1)
  })

  it('should handle special characters', () => {
    expect(getPartialMatchIndex('hello!', '!')).toBe(5)
    expect(getPartialMatchIndex('$price', '$')).toBe(0)
    expect(getPartialMatchIndex('line\nbreak', '\n')).toBe(4)
    expect(getPartialMatchIndex('space test', ' ')).toBe(5)
  })

  it('should find longest partial match when multiple are possible', () => {
    expect(getPartialMatchIndex('hellohel', 'hello world')).toBe(5)
    expect(getPartialMatchIndex('abcab', 'abcdef')).toBe(3)
    expect(getPartialMatchIndex('testtest', 'testing')).toBe(4) // "test" at position 4 is preferred
  })
})
