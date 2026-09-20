import type { JSONSchema7 } from '@xsai/text-primitives'

import { describe, expect, it } from 'vitest'

import { normalizeSchema } from '../src/utils/normalize-schema'

describe('chat normalizeSchema', () => {
  it('normalizes OpenAI strict schemas while preserving supported constraints', () => {
    const schema: JSONSchema7 = {
      additionalProperties: true,
      properties: {
        amount: { maximum: 10, minimum: 0, multipleOf: 2, type: 'number' },
        nested: {
          additionalProperties: true,
          properties: { label: { type: 'string' } },
          required: [],
          type: 'object',
        },
      },
      required: ['amount'],
      type: 'object',
    }

    expect(normalizeSchema(schema)).toEqual({
      additionalProperties: false,
      properties: {
        amount: { maximum: 10, minimum: 0, multipleOf: 2, type: 'number' },
        nested: {
          additionalProperties: false,
          properties: { label: { type: 'string' } },
          required: ['label'],
          type: 'object',
        },
      },
      required: ['amount', 'nested'],
      type: 'object',
    })
    expect(schema).toEqual({
      additionalProperties: true,
      properties: {
        amount: { maximum: 10, minimum: 0, multipleOf: 2, type: 'number' },
        nested: {
          additionalProperties: true,
          properties: { label: { type: 'string' } },
          required: [],
          type: 'object',
        },
      },
      required: ['amount'],
      type: 'object',
    })
  })

  it('uses anyOf and removes siblings from references', () => {
    expect(normalizeSchema({
      $ref: '#/$defs/value',
      description: 'ignored',
      oneOf: [{ type: 'string' }],
    })).toEqual({ $ref: '#/$defs/value' })

    expect(normalizeSchema({
      anyOf: [{ type: 'string' }],
      oneOf: [{ type: 'number' }],
    })).toEqual({ anyOf: [{ type: 'string' }, { type: 'number' }] })
  })

  it('removes unsupported composition keywords', () => {
    expect(normalizeSchema({
      allOf: [{ type: 'string' }],
      else: { type: 'string' },
      if: { type: 'string' },
      not: { type: 'string' },
      properties: { value: { type: 'string' } },
      type: 'object',
    })).toEqual({
      additionalProperties: false,
      properties: { value: { type: 'string' } },
      required: ['value'],
      type: 'object',
    })
  })

  it('removes formats outside the OpenAI subset', () => {
    expect(normalizeSchema({ format: 'uri', type: 'string' }))
      .toEqual({ type: 'string' })
  })
})
