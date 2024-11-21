import { describe, expect, it } from 'vitest'

import { embed } from '../src'

describe('embed', () => {
  it('string', async () => {
    const { embedding, usage } = await embed({
      input: 'sunny day at the beach',
      model: 'nomic-embed-text',
    })

    expect(embedding).toMatchSnapshot()
    expect(usage?.prompt_tokens).toBe(5)
    expect(usage?.total_tokens).toBe(5)
  })

  it('array', async () => {
    const { embedding, usage } = await embed({
      input: ['why is the sky blue?', 'why is the grass green?'],
      model: 'nomic-embed-text',
    })

    expect(embedding).toMatchSnapshot()
    expect(usage?.prompt_tokens).toBe(12)
    expect(usage?.total_tokens).toBe(12)
  })
})
