import { describe, expect, it, vi } from 'vitest'

import { chat } from '../src'

describe('provider-executed results on Chat', () => {
  it('rejects assistant results that Chat Completions cannot replay', async () => {
    const fetch = vi.fn()
    const model = chat({ baseURL: 'https://example.com/v1/', fetch, model: 'test' })

    await expect(model({ input: [{
      content: [{ callId: 'srv_1', output: '[]', providerExecuted: true, type: 'tool-result' }],
      role: 'assistant',
    }] })).rejects.toMatchObject({ code: 'invalid-input' })
    expect(fetch).not.toHaveBeenCalled()
  })
})
