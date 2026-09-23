import type { JSONSchema7 } from '@xsai/text-primitives/internal'

import { describe, expect, it } from 'vitest'

import { normalizeSchema } from '../src/utils/normalize-schema'

describe('responses normalizeSchema', () => {
  it('normalizes OpenAI strict schemas while preserving supported constraints', () => {
    const schema: JSONSchema7 = {
      properties: {
        values: {
          items: { type: 'integer' },
          maxItems: 3,
          minItems: 1,
          type: 'array',
        },
      },
      type: 'object',
    }

    expect(normalizeSchema(schema)).toEqual({
      additionalProperties: false,
      properties: {
        values: {
          items: { type: 'integer' },
          maxItems: 3,
          minItems: 1,
          type: 'array',
        },
      },
      required: ['values'],
      type: 'object',
    })
    expect(schema).toEqual({
      properties: {
        values: {
          items: { type: 'integer' },
          maxItems: 3,
          minItems: 1,
          type: 'array',
        },
      },
      type: 'object',
    })
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
