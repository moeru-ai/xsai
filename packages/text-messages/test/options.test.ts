import { XSAIError } from '@xsai/text-primitives/shared'
import { describe, expect, it } from 'vitest'

import { captureRequests } from '../../text-primitives/test/test-utils'
import { messages } from '../src'

describe('messages options', () => {
  it('maps model options to Messages fields', async () => {
    const { bodies, fetch } = captureRequests('{"type":"message_stop"}')
    const model = messages({ baseURL: 'https://x/', fetch, model: 'm' })
    const stream = await model({
      extraBody: { tool_choice: { disable_parallel_tool_use: true } },
      input: 'hi',
      maxOutputTokens: 10,
      reasoningEffort: 'max',
      temperature: 0.5,
      toolChoice: { name: 'get_weather' },
      topP: 0.9,
    })
    await stream.cancel()

    expect(bodies).toHaveLength(1)
    expect(bodies[0]).toMatchObject({
      max_tokens: 10,
      output_config: { effort: 'max' },
      temperature: 0.5,
      tool_choice: { disable_parallel_tool_use: true },
      top_p: 0.9,
    })
    expect(bodies[0]).not.toHaveProperty('effort')
  })

  it('maps required toolChoice to any and rejects missing maxOutputTokens', async () => {
    const { bodies, fetch } = captureRequests('{"type":"message_stop"}')
    const model = messages({ baseURL: 'https://x/', fetch, model: 'm' })

    await expect(model({ input: 'hi' })).rejects.toThrow(XSAIError)
    await expect(model({ input: 'hi' })).rejects.toMatchObject({
      code: 'invalid-input',
      message: 'maxOutputTokens is required for the Messages API',
    })

    const stream = await model({ input: 'hi', maxOutputTokens: 10, toolChoice: 'required' })
    await stream.cancel()
    expect(bodies[0]).toMatchObject({ tool_choice: { type: 'any' } })
  })

  it('maps format to output_config.format and merges with effort', async () => {
    const { bodies, fetch } = captureRequests('{"type":"message_stop"}')
    const model = messages({ baseURL: 'https://x/', fetch, model: 'm' })
    const stream = await model({
      format: {
        properties: { a: { type: 'string' } },
        required: ['a'],
        title: 'answer',
        type: 'object',
      },
      input: 'hi',
      maxOutputTokens: 10,
      reasoningEffort: 'high',
    })
    await stream.cancel()

    expect(bodies[0].output_config).toMatchObject({
      effort: 'high',
      format: {
        schema: {
          additionalProperties: false,
          properties: { a: { type: 'string' } },
        },
        type: 'json_schema',
      },
    })
  })

  it('preserves an x-api-key supplied through extraHeaders', async () => {
    let requestHeaders: Headers | undefined
    const requestFetch: typeof fetch = async (_input, init) => {
      requestHeaders = new Headers(init?.headers)
      return new Response('data: {"type":"message_stop"}\n\n')
    }
    const model = messages({
      baseURL: 'https://x/',
      extraHeaders: { 'x-api-key': 'custom-key' },
      fetch: requestFetch,
      model: 'm',
    })

    const stream = await model({ input: 'hi', maxOutputTokens: 10 })
    await stream.cancel()

    expect(requestHeaders?.get('x-api-key')).toBe('custom-key')
  })
})
