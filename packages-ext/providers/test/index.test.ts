import { describe, expect, it } from 'vitest'

import { createQianfan } from '../src/create'
import { nvidia, qianfan } from '../src'

describe('@xsai-ext/providers', () => {
  it('nvidia', () => {
    const model = 'openai/gpt-oss-120b'
    const result = nvidia.chat(model)

    expect(result.apiKey).toBe('')
    expect(result.baseURL).toBe('https://integrate.api.nvidia.com/v1')
    expect(result.model).toBe(model)
  })

  it('qianfan', () => {
    const model = 'ernie-4.0-turbo-8k'
    const result = qianfan.chat(model)

    expect(result.apiKey).toBe('')
    expect(result.baseURL).toBe('https://qianfan.baidubce.com/v2')
    expect(result.model).toBe(model)
    expect(qianfan.model()).toEqual({
      apiKey: '',
      baseURL: 'https://qianfan.baidubce.com/v2',
    })
  })

  it('createQianfan accepts a custom baseURL', () => {
    const provider = createQianfan('test-api-key', 'https://example.com/v2')
    const result = provider.chat('ernie-3.5-8k')

    expect(result.apiKey).toBe('test-api-key')
    expect(result.baseURL).toBe('https://example.com/v2')
    expect(result.model).toBe('ernie-3.5-8k')
  })
})
