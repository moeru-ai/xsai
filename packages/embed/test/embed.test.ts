import { describe, expect, it } from 'vitest'

import { embed } from '../src'

describe('@xsai/embed', () => {
  it('embed', async () => {
    const { embedding, usage } = await embed({
      baseURL: 'http://localhost:11434/v1/',
      input: 'sunny day at the beach',
      model: 'all-minilm',
    })

    expect(embedding.length).toBe(384)
    expect(usage.prompt_tokens).toBe(7)
    expect(usage.total_tokens).toBe(7)
  })
})
