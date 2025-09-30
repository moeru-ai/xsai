import { describe, expect, it } from 'vitest'

import { nvidia } from '../src'

describe('@xsai-ext/providers', () => {
  it('nvidia', () => {
    const model = 'openai/gpt-oss-120b'
    const result = nvidia.chat(model)

    expect(result.apiKey).toBeUndefined()
    expect(result.baseURL).toBe('https://integrate.api.nvidia.com/v1')
    expect(result.model).toBe(model)
  })
})
