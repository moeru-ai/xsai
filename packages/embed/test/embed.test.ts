import { describe, expect, it } from 'vitest'

import { embed } from '../src'

describe('@xsai/embed', () => {
  const toFixed = (embedding: number[]) => embedding.map(e => e.toFixed(3))

  it('embed', async () => {
    const { embedding, usage } = await embed({
      baseURL: 'http://localhost:11434/v1/',
      input: 'sunny day at the beach',
      model: 'all-minilm',
    })

    expect(toFixed(embedding)).toMatchSnapshot()
    expect(usage.prompt_tokens).toBe(5)
    expect(usage.total_tokens).toBe(5)
  })
})
