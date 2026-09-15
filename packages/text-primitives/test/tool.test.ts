import type { CombinedStandardSchema } from '../src/utils/schema'

import { describe, expect, it, vi } from 'vitest'

import { tool } from '../src/core/tool'

const standardSchema = <Input = unknown, Output = Input>(json: Record<string, unknown>): CombinedStandardSchema<Input, Output> => ({
  '~standard': {
    jsonSchema: {
      input: () => json,
      output: () => ({}),
    },
    vendor: 'test',
    version: 1,
  },
})

describe('tool', () => {
  it('accepts a raw JSON schema as inputSchema', () => {
    const inputSchema = {
      properties: { city: { type: 'string' } },
      required: ['city'],
      type: 'object',
    }

    const weather = tool({ description: 'Get weather.', inputSchema, name: 'get_weather' })

    expect(weather).toMatchObject({
      description: 'Get weather.',
      name: 'get_weather',
    })
    expect(weather.inputSchema).toBe(inputSchema)
    expect(weather.outputSchema).toBeUndefined()
    expect('execute' in weather).toBe(false)
  })

  it('converts a standard schema through the input side', () => {
    const wire = { properties: { city: { type: 'string' } }, type: 'object' }
    const input = vi.fn(() => wire)
    const schema = {
      '~standard': {
        jsonSchema: { input, output: () => ({}) },
        vendor: 'test',
        version: 1,
      },
    }

    const weather = tool({ inputSchema: schema, name: 'get_weather' })

    expect(input).toHaveBeenCalledOnce()
    expect(input).toHaveBeenCalledWith({ target: 'draft-07' })
    expect(weather.inputSchema).toBe(wire)
  })

  it('resolves the output schema through the output side and keeps handler inference', async () => {
    const output = vi.fn(() => ({ type: 'string' }))
    const weather = tool({
      execute: input => `sunny in ${input.city}`,
      inputSchema: standardSchema<{ city: string }>({ type: 'object' }),
      name: 'get_weather',
      outputSchema: {
        '~standard': {
          jsonSchema: { input: () => ({ type: 'number' }), output },
          vendor: 'test',
          version: 1,
        },
      },
    })

    // the execution-result side is advertised, not the input side
    expect(output).toHaveBeenCalledWith({ target: 'draft-07' })
    expect(weather.outputSchema).toEqual({ type: 'string' })
    await expect(weather.execute({ city: 'Taipei' })).resolves.toBe(JSON.stringify('sunny in Taipei'))
  })

  it('executes a raw-schema tool with unknown input', async () => {
    const weather = tool({
      execute: input => `input was ${JSON.stringify(input)}`,
      inputSchema: { type: 'object' },
      name: 'get_weather',
    })

    await expect(weather.execute({ city: 'Taipei' })).resolves.toBe('input was {"city":"Taipei"}')
  })
})
