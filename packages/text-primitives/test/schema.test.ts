import type { StandardJSONSchemaV1, StandardSchemaV1 } from '@standard-schema/spec'
import type { JSONSchema7 } from 'json-schema'

import { describe, expect, it, vi } from 'vitest'

import { resolveSchema, strictSchema, toFormatName } from '../src/utils/schema'

describe('resolveSchema', () => {
  it('stricts a raw JSON schema in place, without a validator', () => {
    const schema = {
      properties: { a: { type: 'string' } },
      type: 'object',
    }
    const resolved = resolveSchema(schema)

    expect(resolved.schema).toBe(schema)
    expect(resolved.schema).toEqual({
      additionalProperties: false,
      properties: { a: { type: 'string' } },
      required: ['a'],
      type: 'object',
    })
    expect(resolved.validate).toBeUndefined()
  })

  it('converts a StandardJSONSchemaV1 through the input side at draft-07, then stricts it', () => {
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
    expect(resolved.schema).toMatchObject({ additionalProperties: false, required: ['name'] })
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

describe('strictSchema', () => {
  it('forces additionalProperties:false and all-required on every object schema, deeply', () => {
    const schema: JSONSchema7 = {
      properties: {
        list: { items: { properties: { c: { type: 'string' } }, type: 'object' }, type: 'array' },
        nested: { properties: { b: { type: 'number' } }, type: 'object' },
        opt: { type: 'string' },
      },
      required: ['nested'],
      type: 'object',
    }

    expect(strictSchema(schema)).toBe(schema)
    expect(schema).toEqual({
      additionalProperties: false,
      properties: {
        list: {
          items: {
            additionalProperties: false,
            properties: { c: { type: 'string' } },
            required: ['c'],
            type: 'object',
          },
          type: 'array',
        },
        nested: {
          additionalProperties: false,
          properties: { b: { type: 'number' } },
          required: ['b'],
          type: 'object',
        },
        opt: { type: 'string' },
      },
      required: ['list', 'nested', 'opt'],
      type: 'object',
    })
  })

  it('recurses into $defs, anyOf and allOf', () => {
    const schema: JSONSchema7 = {
      $defs: { inner: { properties: { x: { type: 'string' } }, type: 'object' } },
      allOf: [{ properties: { y: { type: 'string' } }, type: 'object' }],
      anyOf: [{ properties: { z: { type: 'string' } }, type: 'object' }],
      type: 'object',
    }

    expect(strictSchema(schema)).toMatchObject({
      $defs: { inner: { additionalProperties: false, required: ['x'] } },
      allOf: [{ additionalProperties: false, required: ['y'] }],
      anyOf: [{ additionalProperties: false, required: ['z'] }],
    })
  })

  it('rewrites oneOf into anyOf, merging into an existing anyOf', () => {
    expect(strictSchema({
      anyOf: [{ type: 'string' }],
      oneOf: [{ properties: { a: { type: 'string' } }, type: 'object' }],
      type: 'object',
    })).toEqual({
      additionalProperties: false,
      anyOf: [{ type: 'string' }, { additionalProperties: false, properties: { a: { type: 'string' } }, required: ['a'], type: 'object' }],
      properties: {},
      required: [],
      type: 'object',
    })

    expect(strictSchema({ oneOf: [{ type: 'string' }] }))
      .toEqual({ anyOf: [{ type: 'string' }] })
  })

  it('strips sibling keywords next to $ref', () => {
    expect(strictSchema(
      { $defs: { a: { type: 'object' } }, $ref: '#/$defs/a', description: 'd', title: 't' },
    )).toEqual({ $ref: '#/$defs/a' })
  })

  it('injects empty properties on object schemas', () => {
    expect(strictSchema({ type: 'object' }))
      .toEqual({ additionalProperties: false, properties: {}, required: [], type: 'object' })
  })

  it('strips numeric constraints on integer/number schemas', () => {
    expect(strictSchema({ maximum: 10, minimum: 0, multipleOf: 2, type: 'integer' }))
      .toEqual({ type: 'integer' })
    expect(strictSchema({ maximum: 10, type: 'string' }))
      .toEqual({ maximum: 10, type: 'string' })
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
