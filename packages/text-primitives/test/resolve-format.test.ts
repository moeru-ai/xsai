import type { StandardJSONSchemaV1 } from '@standard-schema/spec'

import { describe, expect, it } from 'vitest'

import { resolveFormat } from '../src/utils/resolve-format'

const standardSchema = (input: Record<string, unknown>): StandardJSONSchemaV1 => ({
  '~standard': {
    jsonSchema: {
      input: () => input,
      output: () => ({}),
    },
    vendor: 'test',
    version: 1,
  },
})

describe('resolveFormat', () => {
  it('returns undefined for no format', () => {
    expect(resolveFormat(undefined)).toBeUndefined()
  })

  it('passes a raw JSON schema through with strict defaults', () => {
    const format = {
      properties: { a: { type: 'string' } },
      required: ['a'],
      type: 'object',
    }
    const resolved = resolveFormat(format)!

    expect(resolved).toMatchObject({
      name: 'output',
      schema: {
        additionalProperties: false,
        properties: { a: { type: 'string' } },
      },
    })
    expect(resolved.description).toBeUndefined()
    // the caller's schema object is not mutated
    expect(format).not.toHaveProperty('additionalProperties')
  })

  it('recurses into nested objects', () => {
    const resolved = resolveFormat({
      properties: { nested: { properties: { b: { type: 'string' } }, type: 'object' } },
      type: 'object',
    })!

    expect((resolved.schema.properties as Record<string, unknown>).nested)
      .toMatchObject({ additionalProperties: false })
  })

  it('converts a StandardJSONSchemaV1 through the input side', () => {
    const resolved = resolveFormat(standardSchema({
      description: 'a user',
      properties: { name: { type: 'string' } },
      title: 'user',
      type: 'object',
    }))!

    expect(resolved).toMatchObject({
      description: 'a user',
      name: 'user',
      schema: { additionalProperties: false },
    })
  })

  it.each([
    ['User Profile!', 'User_Profile_'],
    ['a'.repeat(100), 'a'.repeat(64)],
    ['用户信息', '____'],
  ])('sanitizes title %s into the wire name %s', (title, name) => {
    expect(resolveFormat({ title, type: 'object' })!.name).toBe(name)
  })
})
