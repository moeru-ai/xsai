import { describe, expect, it } from 'vitest'

import { captureRequests } from '../../text-primitives/test/test-utils'
import { chat } from '../src'

describe('chat options', () => {
  it('maps model options to Chat Completions fields', async () => {
    const { bodies, fetch } = captureRequests()
    const model = chat({ baseURL: 'https://x/v1/', fetch, model: 'm' })
    const stream = await model({ input: 'hi' }, {
      extraBody: { stream_options: { custom: true } },
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
      stream_options: { custom: true, include_usage: true },
      temperature: 0.5,
      tool_choice: { function: { name: 'get_weather' }, type: 'function' },
      top_p: 0.9,
    })
  })
})
