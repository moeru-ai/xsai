import type { Promisable } from '@xsai/shared'
import type { JSONSchema7 } from 'json-schema'

import type { ToolExecuteOptions as PublicToolExecuteOptions } from '../../xsai/src'
import type { ToolExecuteOptions } from '../src/tool'
import type { ToolResultPart } from '../src/types'
import type { CombinedStandardSchema } from '../src/utils/schema'

import { describe, expect, expectTypeOf, it, vi } from 'vitest'

import { tool } from '../src/tool'
import { executeTool, executeTools } from '../src/utils/execute-tools'

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
  it('exports the execution context through xsai', () => {
    expectTypeOf<PublicToolExecuteOptions>().toEqualTypeOf<ToolExecuteOptions>()
    expectTypeOf<ToolExecuteOptions>().toEqualTypeOf<{ callId: string, signal?: AbortSignal }>()
  })

  it('preserves call IDs and signals when parallel calls finish in reverse order', async () => {
    const first = Promise.withResolvers<string>()
    const secondFinished = Promise.withResolvers<void>()
    const signal = new AbortController().signal
    const completed: string[] = []
    const contexts: ToolExecuteOptions[] = []
    const weather = tool({
      execute: async (_input, options) => {
        if (options == null)
          throw new Error('Missing tool context')
        contexts.push(options)
        const result = options.callId === 'call-1' ? await first.promise : 'second'
        completed.push(options.callId)
        return result
      },
      inputSchema: { type: 'object' },
      name: 'get_weather',
    })
    const preToolCall = vi.fn()
    const postToolCall = vi.fn((_result: ToolResultPart, options: ToolExecuteOptions) => {
      if (options.callId !== 'call-2')
        return
      secondFinished.resolve()
    })

    const pending = executeTools({
      postToolCall,
      preToolCall,
      signal,
      toolCalls: ['call-1', 'call-2'].map(callId => ({
        arguments: '{}',
        callId,
        id: `item-${callId}`,
        name: 'get_weather',
        type: 'tool-call',
      })),
      tools: [weather],
    })

    await secondFinished.promise
    expect(completed).toEqual(['call-2'])
    first.resolve('first')

    await expect(pending).resolves.toEqual([
      { callId: 'call-1', output: 'first', type: 'tool-result' },
      { callId: 'call-2', output: 'second', type: 'tool-result' },
    ])
    expect(completed).toEqual(['call-2', 'call-1'])
    expect(contexts).toEqual([{ callId: 'call-1', signal }, { callId: 'call-2', signal }])
    for (const callId of ['call-1', 'call-2']) {
      expect(preToolCall).toHaveBeenCalledWith(expect.objectContaining({ callId }), { callId, signal })
      expect(postToolCall).toHaveBeenCalledWith(expect.objectContaining({ callId }), { callId, signal })
    }
  })

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
    expect(execute).toHaveBeenCalledWith({ city: 'Taipei' }, { callId: 'call-1', signal: undefined })
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

  it.each([false, true])('serializes validated output (async: %s)', async (isAsync) => {
    const outputSchema: CombinedStandardSchema<string, { city: string }> = {
      '~standard': {
        ...standardSchema<string, { city: string }>({ type: 'string' })['~standard'],
        validate: (input): Promisable<{ value: { city: string } }> => {
          const result = { value: { city: (input as string).trim() } }
          return isAsync ? Promise.resolve(result) : result
        },
      },
    }
    const weather = tool({
      execute: () => ' Taipei ',
      inputSchema: { type: 'object' },
      name: 'get_weather',
      outputSchema,
    })

    await expect(weather.execute({})).resolves.toBe('{"city":"Taipei"}')
  })
})

describe('tool call hooks', () => {
  const call = {
    arguments: '{"city":"Taipei"}',
    callId: 'call-1',
    id: 'tool-1',
    name: 'get_weather',
    type: 'tool-call' as const,
  }

  it('rewrites tool calls and results', async () => {
    const execute = vi.fn((input: unknown) => `weather in ${(input as { city: string }).city}`)
    const weather = tool({ execute, inputSchema: { type: 'object' }, name: 'get_weather' })

    const result = await executeTool(call, {
      postToolCall: toolResult => ({ ...toolResult, output: 'patched weather' }),
      preToolCall: toolCall => ({ ...toolCall, arguments: '{"city":"Hong Kong"}' }),
      tools: [weather],
    })

    expect(execute).toHaveBeenCalledWith({ city: 'Hong Kong' }, { callId: 'call-1', signal: undefined })
    expect(result).toEqual({ callId: 'call-1', output: 'patched weather', type: 'tool-result' })
  })

  it('lets preToolCall provide a result without executing or posting', async () => {
    const execute = vi.fn(() => 'sunny')
    const postToolCall = vi.fn()
    const weather = tool({ execute, inputSchema: { type: 'object' }, name: 'get_weather' })

    const result = await executeTool(call, {
      postToolCall,
      preToolCall: () => ({ callId: 'call-1', output: 'not allowed', type: 'tool-result' }),
      tools: [weather],
    })

    expect(result.output).toBe('not allowed')
    expect(execute).not.toHaveBeenCalled()
    expect(postToolCall).not.toHaveBeenCalled()
  })

  it('turns hook failures into tool results', async () => {
    const weather = tool({ execute: () => 'sunny', inputSchema: { type: 'object' }, name: 'get_weather' })
    const postToolCall = vi.fn(() => {
      throw new Error('post boom')
    })

    const postResult = await executeTool(call, { postToolCall, tools: [weather] })
    const preResult = await executeTool(call, {
      postToolCall,
      preToolCall: () => {
        throw new Error('pre boom')
      },
      tools: [weather],
    })

    expect(postResult.output).toBe('Tool "get_weather" execution failed: post boom')
    expect(preResult.output).toBe('Tool "get_weather" execution failed: pre boom')
    expect(postToolCall).toHaveBeenCalledOnce()
  })

  it('requires hooks to preserve the tool call id', async () => {
    const weather = tool({ execute: () => 'sunny', inputSchema: { type: 'object' }, name: 'get_weather' })

    await expect(executeTool(call, {
      preToolCall: toolCall => ({ ...toolCall, callId: 'call-2' }),
      tools: [weather],
    })).rejects.toThrow('must preserve callId')

    await expect(executeTool(call, {
      postToolCall: toolResult => ({ ...toolResult, callId: 'call-2' }),
      tools: [weather],
    })).rejects.toThrow('must preserve callId')
  })
})
