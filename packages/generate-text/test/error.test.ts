import { NoChoicesReturnedError } from '@xsai/shared'
import { describe, expect, it } from 'vitest'

import { generateText } from '../src'

describe('@xsai/generate-text errors', () => {
  it('throws NoChoicesReturnedError when the provider returns no choices', async () => {
    const fetch: typeof globalThis.fetch = async () => new Response(JSON.stringify({
      choices: [],
      created: 1,
      id: 'chatcmpl_1',
      model: 'test-model',
      object: 'chat.completion',
      system_fingerprint: 'fingerprint',
      usage: {
        completion_tokens: 0,
        prompt_tokens: 0,
        total_tokens: 0,
      },
    }))

    await expect(generateText({
      baseURL: 'https://example.com/v1/',
      fetch,
      messages: [{ content: 'hello', role: 'user' }],
      model: 'test-model',
    })).rejects.toBeInstanceOf(NoChoicesReturnedError)
  })
})
