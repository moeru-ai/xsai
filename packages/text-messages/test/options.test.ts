import { XSAIError } from '@xsai/text-primitives/shared'
import { describe, expect, it } from 'vitest'

import { captureRequests } from '../../text-primitives/test/test-utils'
import { messages } from '../src'

describe('messages options', () => {
  it('maps model options to Messages fields', async () => {
    const { bodies, fetch } = captureRequests('{"type":"message_stop"}')
    const model = messages({ baseURL: 'https://x/', fetch, model: 'm' })
    const stream = await model({ input: 'hi' }, {
      extraBody: { tool_choice: { disable_parallel_tool_use: true } },
      maxOutputTokens: 10,
      reasoningEffort: 'max',
      temperature: 0.5,
      toolChoice: { name: 'get_weather' },
      topP: 0.9,
    })
    await stream.cancel()

    expect(bodies).toHaveLength(1)
    expect(bodies[0]).toMatchObject({
      effort: 'max',
      max_tokens: 10,
      temperature: 0.5,
      tool_choice: { disable_parallel_tool_use: true, name: 'get_weather', type: 'tool' },
      top_p: 0.9,
    })
  })

  it('maps required toolChoice to any and rejects missing maxOutputTokens', async () => {
    const { bodies, fetch } = captureRequests('{"type":"message_stop"}')
    const model = messages({ baseURL: 'https://x/', fetch, model: 'm' })

    await expect(model({ input: 'hi' })).rejects.toThrow(XSAIError)
    await expect(model({ input: 'hi' })).rejects.toMatchObject({
      code: 'invalid-input',
      message: 'maxOutputTokens is required for the Messages API',
    })

    const stream = await model({ input: 'hi' }, { maxOutputTokens: 10, toolChoice: 'required' })
    await stream.cancel()
    expect(bodies[0]).toMatchObject({ tool_choice: { type: 'any' } })
  })
})
