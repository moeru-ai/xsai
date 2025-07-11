import { describe, expect, it } from 'vitest'

import { embedMany } from '../src'

describe('@xsai/embed', () => {
  it('array', async () => {
    const { embeddings, usage } = await embedMany({
      baseURL: 'http://localhost:11434/v1/',
      input: ['why is the sky blue?', 'why is the grass green?'],
      model: 'granite-embedding',
    })

    expect(embeddings).toMatchSnapshot()
    expect(usage.prompt_tokens).toBe(12)
    expect(usage.total_tokens).toBe(12)
  })
})
