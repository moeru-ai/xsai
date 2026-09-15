import type { StandardJSONSchemaV1, StandardSchemaV1 } from '@standard-schema/spec'

import { describe, expect, it, vi } from 'vitest'

import { resolveSchema, toFormatName } from '../src/utils/schema'

describe('resolveSchema', () => {
  it('returns a raw JSON schema untouched, without a validator', () => {
    const schema = {
      properties: { a: { type: 'string' } },
      required: ['a'],
      type: 'object',
    }
    const resolved = resolveSchema(schema)

    expect(resolved.schema).toBe(schema)
    expect(resolved.schema).not.toHaveProperty('additionalProperties')
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
    expect(resolved.validate).toBeUndefined()
  })

  it('resolves through the output side when direction is output', () => {
    const input = vi.fn(() => ({ type: 'number' }))
    const output = vi.fn(() => ({ type: 'string' }))
    const schema = {
      '~standard': {
        jsonSchema: { input, output },
        vendor: 'test',
        version: 1,
      },
    }

    expect(resolveSchema(schema, { direction: 'output' }).schema).toEqual({ type: 'string' })
    expect(output).toHaveBeenCalledWith({ target: 'draft-07' })
    expect(input).not.toHaveBeenCalled()
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

describe('toFormatName', () => {
  it.each([
    ['User Profile!', 'User_Profile_'],
    ['a'.repeat(100), 'a'.repeat(64)],
    ['用户信息', '____'],
  ])('sanitizes title %s into the wire name %s', (title, name) => {
    expect(toFormatName(title)).toBe(name)
  })

  it.each([
    [undefined],
    [null],
    [42],
    [''],
  ])('falls back to output for %s', (title) => {
    expect(toFormatName(title)).toBe('output')
  })
})
