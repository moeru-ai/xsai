import type { JSONSchema7 } from '@xsai/text-primitives/internal'

import { describe, expect, it } from 'vitest'

import { normalizeSchema } from '../src/utils/normalize-schema'

describe('messages normalizeSchema', () => {
  it('keeps optional fields and removes unsupported constraints', () => {
    const schema: JSONSchema7 = {
      additionalProperties: true,
      properties: {
        amount: { maximum: 10, minimum: 0, multipleOf: 2, type: 'number' },
        list: { items: { type: 'string' }, maxItems: 3, minItems: 2, type: 'array' },
        short: { format: 'json-pointer', maxLength: 20, minLength: 1, type: 'string' },
        uri: { format: 'uri', type: 'string' },
      },
      required: ['amount'],
      type: 'object',
    }

    expect(normalizeSchema(schema)).toEqual({
      additionalProperties: false,
      properties: {
        amount: { type: 'number' },
        list: { items: { type: 'string' }, type: 'array' },
        short: { type: 'string' },
        uri: { format: 'uri', type: 'string' },
      },
      required: ['amount'],
      type: 'object',
    })
    expect(schema).toEqual({
      additionalProperties: true,
      properties: {
        amount: { maximum: 10, minimum: 0, multipleOf: 2, type: 'number' },
        list: { items: { type: 'string' }, maxItems: 3, minItems: 2, type: 'array' },
        short: { format: 'json-pointer', maxLength: 20, minLength: 1, type: 'string' },
        uri: { format: 'uri', type: 'string' },
      },
      required: ['amount'],
      type: 'object',
    })
  })

  it('preserves Anthropic-supported references and allOf schemas', () => {
    expect(normalizeSchema({
      $defs: { value: { default: 'x', type: 'string' } },
      allOf: [{ properties: { label: { type: 'string' } }, type: 'object' }],
      description: 'kept',
      type: 'object',
    })).toEqual({
      $defs: { value: { default: 'x', type: 'string' } },
      additionalProperties: false,
      allOf: [{ additionalProperties: false, properties: { label: { type: 'string' } }, type: 'object' }],
      description: 'kept',
      properties: {},
      type: 'object',
    })

    expect(normalizeSchema({ $ref: '#/$defs/value', description: 'kept' }))
      .toEqual({ $ref: '#/$defs/value', description: 'kept' })
  })
})
