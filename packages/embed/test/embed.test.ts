import { describe, expect, it } from 'vitest'

import { embed } from '../src'

describe('@xsai/embed', () => {
  it('embed', async () => {
    const { embedding, usage } = await embed({
      baseURL: 'http://localhost:11434/v1/',
      input: 'sunny day at the beach',
      model: 'granite-embedding',
    })

    expect(embedding).toMatchSnapshot()
    expect(usage.prompt_tokens).toBe(6)
    expect(usage.total_tokens).toBe(6)
  })
})
