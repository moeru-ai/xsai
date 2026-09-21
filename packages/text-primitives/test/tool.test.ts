import type { JSONSchema7 } from 'json-schema'

import type { CombinedStandardSchema } from '../src/utils/schema'

import { describe, expect, it, vi } from 'vitest'

import { tool } from '../src/core/tool'
import { executeTool } from '../src/loop/execute-tools'

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
  it('accepts a raw JSON schema as inputSchema without wire normalization', () => {
    const inputSchema: JSONSchema7 = {
      properties: { city: { type: 'string' } },
      required: ['city'],
      type: 'object',
    }

    const weather = tool({ description: 'Get weather.', inputSchema, name: 'get_weather' })

    expect(weather).toMatchObject({
      description: 'Get weather.',
      name: 'get_weather',
    })
    expect(weather.inputSchema.schema).toBe(inputSchema)
    expect(weather.inputSchema.schema).toEqual(inputSchema)
    expect(weather.outputSchema).toBeUndefined()
    expect('execute' in weather).toBe(false)
  })

  it('converts a standard schema through the input side', () => {
    const wire = { properties: { city: { type: 'string' } }, type: 'object' }
    const input = vi.fn(() => wire)
    const schema: CombinedStandardSchema = {
      '~standard': {
        jsonSchema: { input, output: () => ({}) },
        vendor: 'test',
        version: 1,
      },
    }

    const weather = tool({ inputSchema: schema, name: 'get_weather' })

    expect(input).toHaveBeenCalledOnce()
    expect(input).toHaveBeenCalledWith({ target: 'draft-07' })
    expect(weather.inputSchema.schema).toBe(wire)
    expect(weather.inputSchema.schema).toEqual(wire)
  })

  it('validates input and executes with the Standard Schema output', async () => {
    const validate = vi.fn(async (input: unknown) => ({
      value: { city: (input as { location: string }).location },
    }))
    const schema = {
      '~standard': {
        jsonSchema: {
          input: () => ({ type: 'object' }),
          output: () => ({ type: 'object' }),
        },
        validate,
        vendor: 'test',
        version: 1,
      },
    } as CombinedStandardSchema<{ location: string }, { city: string }>
    const execute = vi.fn((input: { city: string }) => `weather in ${input.city}`)
    const weather = tool({ execute, inputSchema: schema, name: 'get_weather' })

    const result = await executeTool({
      arguments: '{"location":"Taipei"}',
      callId: 'call-1',
      id: 'tool-1',
      name: 'get_weather',
      type: 'tool-call',
    }, { tools: [weather] })

    expect(result.output).toBe('weather in Taipei')
    expect(validate).toHaveBeenCalledWith({ location: 'Taipei' })
    expect(execute).toHaveBeenCalledWith({ city: 'Taipei' }, { signal: undefined })
  })

  it('does not execute when input validation fails', async () => {
    const execute = vi.fn(() => 'unreachable')
    const schema = {
      '~standard': {
        jsonSchema: {
          input: () => ({ type: 'object' }),
          output: () => ({ type: 'object' }),
        },
        validate: () => ({ issues: [{ message: 'city is required' }] }),
        vendor: 'test',
        version: 1,
      },
    } as CombinedStandardSchema
    const weather = tool({ execute, inputSchema: schema, name: 'get_weather' })

    const result = await executeTool({
      arguments: '{}',
      callId: 'call-1',
      id: 'tool-1',
      name: 'get_weather',
      type: 'tool-call',
    }, { tools: [weather] })

    expect(result.output).toBe('Tool "get_weather" execution failed: Tool input validation failed for "get_weather".')
    expect(execute).not.toHaveBeenCalled()
  })

  it('leaves direct execution input untouched', async () => {
    const validate = vi.fn(() => ({ value: { city: 'Validated Taipei' } }))
    const schema = {
      '~standard': {
        jsonSchema: {
          input: () => ({ type: 'object' }),
          output: () => ({ type: 'object' }),
        },
        validate,
        vendor: 'test',
        version: 1,
      },
    } as CombinedStandardSchema<{ location: string }, { city: string }>
    const weather = tool({
      execute: input => `weather in ${input.city}`,
      inputSchema: schema,
      name: 'get_weather',
    })

    await expect(weather.execute({ city: 'Direct Taipei' })).resolves.toBe('weather in Direct Taipei')
    expect(validate).not.toHaveBeenCalled()
  })

  it('resolves the output schema and keeps handler inference', async () => {
    const weather = tool({
      execute: input => `sunny in ${input.city}`,
      inputSchema: standardSchema<{ city: string }>({ type: 'object' }),
      name: 'get_weather',
      outputSchema: { type: 'string' },
    })

    expect(weather.outputSchema?.schema).toEqual({ type: 'string' })
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
