import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { captureRequests } from '../../text-primitives/test/test-utils'
import { chat } from '../src'

describe('chat options', () => {
  it('maps model options to Chat Completions fields', async () => {
    const { bodies, fetch } = captureRequests()
    const model = chat({ baseURL: 'https://x/v1/', fetch, model: 'm' })
    const stream = await model({ input: 'hi' }, {
      extraBody: { stream_options: { custom: true }, temperature: 0.7 },
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
      // extraBody replaces wire fields wholesale, even adapter-set ones.
      stream_options: { custom: true },
      temperature: 0.7,
      tool_choice: { function: { name: 'get_weather' }, type: 'function' },
      top_p: 0.9,
    })
  })

  it('maps format to response_format.json_schema', async () => {
    const { bodies, fetch } = captureRequests()
    const model = chat({ baseURL: 'https://x/v1/', fetch, model: 'm' })
    const stream = await model({ input: 'hi' }, {
      format: {
        description: 'The answer',
        properties: { a: { type: 'string' } },
        required: ['a'],
        title: 'answer',
        type: 'object',
      },
    })
    await stream.cancel()

    expect(bodies[0].response_format).toMatchObject({
      json_schema: {
        description: 'The answer',
        name: 'answer',
        schema: {
          additionalProperties: false,
          properties: { a: { type: 'string' } },
        },
        strict: true,
      },
      type: 'json_schema',
    })
  })

  it('accepts a StandardJSONSchemaV1 as format', async () => {
    const { bodies, fetch } = captureRequests()
    const model = chat({ baseURL: 'https://x/v1/', fetch, model: 'm' })
    const stream = await model({ input: 'hi' }, {
      format: z.object({ name: z.string() }).meta({ title: 'user' }),
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

  it('lets extraBody override response_format', async () => {
    const { bodies, fetch } = captureRequests()
    const model = chat({ baseURL: 'https://x/v1/', fetch, model: 'm' })
    const stream = await model({ input: 'hi' }, {
      extraBody: { response_format: { type: 'json_object' } },
      format: { title: 'answer', type: 'object' },
    })
    await stream.cancel()

    expect(bodies[0].response_format).toEqual({ type: 'json_object' })
  })
})
