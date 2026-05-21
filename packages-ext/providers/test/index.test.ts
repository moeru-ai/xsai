import { describe, expect, it } from 'vitest'

import { nearai, nvidia } from '../src'
import { createNearAI } from '../src/create'

describe('@xsai-ext/providers', () => {
  it('nvidia', () => {
    const model = 'openai/gpt-oss-120b'
    const result = nvidia.chat(model)

    expect(result.apiKey).toBe('')
    expect(result.baseURL).toBe('https://integrate.api.nvidia.com/v1')
    expect(result.model).toBe(model)
  })

  it('nearai', () => {
    const model = 'openai/gpt-oss-120b'
    const result = nearai.chat(model)

    expect(result.apiKey).toBe('')
    expect(result.baseURL).toBe('https://cloud-api.near.ai/v1')
    expect(result.model).toBe(model)
  })

  it('createNearAI', () => {
    const provider = createNearAI('test-key', 'https://example.test/v1')

    expect(provider.model()).toStrictEqual({
      apiKey: 'test-key',
      baseURL: 'https://example.test/v1',
    })
  })
})
