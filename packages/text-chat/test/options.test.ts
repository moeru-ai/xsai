import type { JSONSchema7 } from '@xsai/text-primitives/internal'

import { tool } from '@xsai/text-primitives'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { captureRequests } from '../../text-primitives/test/test-utils'
import { chat } from '../src'

describe('chat options', () => {
  it('maps model options to Chat Completions fields', async () => {
    const { bodies, fetch } = captureRequests()
    const model = chat({ baseURL: 'https://x/v1/', fetch, model: 'm' })
    const stream = await model({
      input: 'hi',
      maxOutputTokens: 10,
      reasoningEffort: 'low',
      temperature: 0.5,
      toolChoice: { name: 'get_weather' },
      topP: 0.9,
    })
    await stream.cancel()

    expect(bodies).toHaveLength(1)
    expect(bodies[0]).toMatchObject({
      max_tokens: 10,
      reasoning_effort: 'low',
      stream_options: { include_usage: true },
      temperature: 0.5,
      tool_choice: { function: { name: 'get_weather' }, type: 'function' },
      top_p: 0.9,
    })
  })

  it('maps outputFormat to response_format.json_schema', async () => {
    const { bodies, fetch } = captureRequests()
    const model = chat({ baseURL: 'https://x/v1/', fetch, model: 'm' })
    const stream = await model({
      input: 'hi',
      outputFormat: {
        description: 'The answer',
        properties: { a: { type: 'string' } },
        required: ['a'],
        title: 'User Profile!',
        type: 'object',
      },
    })
    await stream.cancel()

    expect(bodies[0].response_format).toMatchObject({
      json_schema: {
        description: 'The answer',
        name: 'User_Profile_',
        schema: {
          additionalProperties: false,
          properties: { a: { type: 'string' } },
        },
        strict: true,
      },
      type: 'json_schema',
    })
  })

  it('normalizes strict output and tool schemas with OpenAI constraints', async () => {
    const { bodies, fetch } = captureRequests()
    const model = chat({ baseURL: 'https://x/v1/', fetch, model: 'm' })
    const schema: JSONSchema7 = {
      properties: {
        amount: { maximum: 10, minimum: 0, type: 'number' },
        optional: { type: 'string' },
      },
      required: ['amount'],
      type: 'object',
    }
    const stream = await model({
      input: 'hi',
      outputFormat: schema,
      tools: [tool({ inputSchema: schema, name: 'measure' })],
    })
    await stream.cancel()

    const normalized = {
      additionalProperties: false,
      properties: {
        amount: { maximum: 10, minimum: 0, type: 'number' },
        optional: { type: 'string' },
      },
      required: ['amount', 'optional'],
      type: 'object',
    }
    expect(bodies[0].response_format).toMatchObject({ json_schema: { schema: normalized } })
    expect(bodies[0].tools).toMatchObject([{ function: { parameters: normalized } }])
    expect(schema).toEqual({
      properties: {
        amount: { maximum: 10, minimum: 0, type: 'number' },
        optional: { type: 'string' },
      },
      required: ['amount'],
      type: 'object',
    })
  })

  it('accepts a StandardJSONSchemaV1 as outputFormat', async () => {
    const { bodies, fetch } = captureRequests()
    const model = chat({ baseURL: 'https://x/v1/', fetch, model: 'm' })
    const stream = await model({
      input: 'hi',
      outputFormat: z.object({ name: z.string() }).meta({ title: 'user' }),
    })
    await stream.cancel()

    expect(bodies[0].response_format).toMatchObject({
      json_schema: {
        name: 'user',
        schema: {
          additionalProperties: false,
          properties: { name: { type: 'string' } },
        },
        strict: true,
      },
      type: 'json_schema',
    })
  })
})
