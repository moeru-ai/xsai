import { describe, expect, it } from 'vitest'

import { embedMany } from '../src'

describe('@xsai/embed', () => {
  const toFixed = (embedding: number[]) => embedding.map(e => e.toFixed(2))

  it('embedMany', async () => {
    const { embeddings, usage } = await embedMany({
      baseURL: 'http://localhost:11434/v1/',
      input: ['why is the sky blue?', 'why is the grass green?'],
      model: 'all-minilm',
    })

    expect(embeddings.map(toFixed)).toMatchSnapshot()
    expect(usage.prompt_tokens).toBe(16)
    expect(usage.total_tokens).toBe(16)
  })
})
