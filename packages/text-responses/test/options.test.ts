import { describe, expect, it } from 'vitest'

import { captureRequests } from '../../text-primitives/test/test-utils'
import { responses } from '../src'

describe('responses options', () => {
  it('maps model options to Responses fields', async () => {
    const { bodies, fetch } = captureRequests()
    const model = responses({ baseURL: 'https://x/', fetch, model: 'm' })
    const stream = await model({ input: 'hi' }, {
      extraBody: { reasoning: { summary: 'detailed' } },
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
      // extraBody replaces the normalized reasoning field wholesale.
      reasoning: { summary: 'detailed' },
      temperature: 0.5,
      tool_choice: { name: 'get_weather', type: 'function' },
      top_p: 0.9,
    })
  })

  it('maps format to text.format', async () => {
    const { bodies, fetch } = captureRequests()
    const model = responses({ baseURL: 'https://x/', fetch, model: 'm' })
    const stream = await model({ input: 'hi' }, {
      format: {
        properties: { a: { type: 'string' } },
        required: ['a'],
        title: 'answer',
        type: 'object',
      },
    })
    await stream.cancel()

    expect(bodies[0].text).toMatchObject({
      format: {
        name: 'answer',
        schema: {
          additionalProperties: false,
          properties: { a: { type: 'string' } },
        },
        strict: true,
        type: 'json_schema',
      },
    })
  })
})
