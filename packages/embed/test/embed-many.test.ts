import { ollama } from '@xsai/providers'
import { describe, expect, it } from 'vitest'

import { embedMany } from '../src'

describe('@xsai/embed', () => {
  it('array', async () => {
    const { embeddings, usage } = await embedMany({
      ...ollama.embeddings('nomic-embed-text'),
      input: ['why is the sky blue?', 'why is the grass green?'],
    })

    expect(embeddings).toMatchSnapshot()
    expect(usage.prompt_tokens).toBe(12)
    expect(usage.total_tokens).toBe(12)
  })
})
