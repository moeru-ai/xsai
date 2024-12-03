import { ollama } from '@xsai/providers'
import { describe, expect, it } from 'vitest'

import { embed } from '../src'

describe('@xsai/embed', () => {
  it('embed', async () => {
    const { embedding, usage } = await embed({
      ...ollama.embeddings('nomic-embed-text'),
      input: 'sunny day at the beach',
    })

    expect(embedding).toMatchSnapshot()
    expect(usage.prompt_tokens).toBe(5)
    expect(usage.total_tokens).toBe(5)
  })
})
