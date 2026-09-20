import type { StandardJSONSchemaV1, StandardSchemaV1 } from '@standard-schema/spec'

import { describe, expect, it, vi } from 'vitest'

import { resolveSchema } from '../src/utils/schema'

describe('resolveSchema', () => {
  it('returns a raw JSON schema in place, without a validator', () => {
    const schema = {
      properties: { a: { type: 'string' } },
      type: 'object',
    }
    const resolved = resolveSchema(schema)

    expect(resolved.schema).toBe(schema)
    expect(resolved.schema).toEqual(schema)
    expect(resolved.validate).toBeUndefined()
  })

  it('converts a StandardJSONSchemaV1 through the input side at draft-07', () => {
    const wire = { properties: { name: { type: 'string' } }, type: 'object' }
    const input = vi.fn(() => wire)
    const resolved = resolveSchema({
      '~standard': {
        jsonSchema: { input, output: () => ({}) },
        vendor: 'test',
        version: 1,
      },
    })

    expect(input).toHaveBeenCalledOnce()
    expect(input).toHaveBeenCalledWith({ target: 'draft-07' })
    expect(resolved.schema).toBe(wire)
    expect(resolved.schema).toEqual(wire)
    expect(resolved.validate).toBeUndefined()
  })

  it('keeps the optional Standard Schema validator from the same object', () => {
    const validate = vi.fn((value: unknown) => ({ value }))
    const schema = {
      '~standard': {
        jsonSchema: { input: () => ({ type: 'object' }), output: () => ({}) },
        validate,
        vendor: 'test',
        version: 1,
      },
    } satisfies StandardJSONSchemaV1 & StandardSchemaV1

    expect(resolveSchema(schema).validate).toBe(validate)
  })

  it('does not mistake a raw schema carrying a ~standard field for Standard JSON', () => {
    const schema = { 'type': 'object', '~standard': { junk: true } }
    const resolved = resolveSchema(schema)

    expect(resolved.schema).toBe(schema)
    expect(resolved.validate).toBeUndefined()
  })
})
