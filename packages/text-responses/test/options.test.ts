import { describe, expect, it } from 'vitest'

import { captureRequests } from '../../text-primitives/test/test-utils'
import { responses } from '../src'

describe('responses options', () => {
  it('maps model options to Responses fields', async () => {
    const { bodies, fetch } = captureRequests()
    const model = responses({ baseURL: 'https://x/', fetch, model: 'm' })
    const stream = await model({
      extraBody: { reasoning: { summary: 'detailed' } },
      input: 'hi',
      maxOutputTokens: 10,
      reasoningEffort: 'high',
      temperature: 0.5,
      toolChoice: { name: 'get_weather' },
      topP: 0.9,
    })
    await stream.cancel()

    expect(bodies).toHaveLength(1)
    expect(bodies[0]).toMatchObject({
      max_output_tokens: 10,
      reasoning: { summary: 'detailed' },
      temperature: 0.5,
      tool_choice: { name: 'get_weather', type: 'function' },
      top_p: 0.9,
    })
  })

  it('maps outputFormat to text.format', async () => {
    const { bodies, fetch } = captureRequests()
    const model = responses({ baseURL: 'https://x/', fetch, model: 'm' })
    const stream = await model({
      input: 'hi',
      outputFormat: {
        properties: { a: { type: 'string' } },
        required: ['a'],
        title: 'User Profile!',
        type: 'object',
      },
    })
    await stream.cancel()

    expect(bodies[0].text).toMatchObject({
      format: {
        name: 'User_Profile_',
        schema: {
          additionalProperties: false,
          properties: { a: { type: 'string' } },
        },
        strict: true,
        type: 'json_schema',
      },
    })
  })

  it('normalizes strict output with OpenAI constraints', async () => {
    const { bodies, fetch } = captureRequests()
    const model = responses({ baseURL: 'https://x/', fetch, model: 'm' })
    const schema = {
      properties: {
        amount: { maximum: 10, minimum: 0, type: 'number' },
        optional: { type: 'string' },
      },
      required: ['amount'],
      type: 'object',
    }
    const stream = await model({ input: 'hi', outputFormat: schema })
    await stream.cancel()

    expect(bodies[0].text).toMatchObject({
      format: {
        schema: {
          additionalProperties: false,
          properties: {
            amount: { maximum: 10, minimum: 0, type: 'number' },
            optional: { type: 'string' },
          },
          required: ['amount', 'optional'],
          type: 'object',
        },
      },
    })
    expect(schema).toEqual({
      properties: {
        amount: { maximum: 10, minimum: 0, type: 'number' },
        optional: { type: 'string' },
      },
      required: ['amount'],
      type: 'object',
    })
  })
})
