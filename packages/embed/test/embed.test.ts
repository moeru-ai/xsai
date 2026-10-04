import type { EmbeddingModel, EmbeddingModelOptions } from '../src'

import { describe, expect, it, vi } from 'vitest'

import { embed } from '../src'

describe('embed', () => {
  it('returns one embedding and usage for a string input', async () => {
    const model = vi.fn<EmbeddingModel>().mockResolvedValue({
      embeddings: [[0.25, -0.5]],
      usage: { promptTokens: 3, totalTokens: 3 },
    })
    const options = {
      input: 'hello',
      providerOptions: { embeddings: { dimensions: 2 } },
      signal: new AbortController().signal,
    } satisfies EmbeddingModelOptions

    const result = await embed(model, options)

    expect(result).toEqual({ embedding: [0.25, -0.5], usage: { promptTokens: 3, totalTokens: 3 } })
    expect(model).toHaveBeenCalledExactlyOnceWith(options)
  })

  it('propagates model failures', async () => {
    const error = new Error('Embedding failed')
    const model = vi.fn<EmbeddingModel>().mockRejectedValue(error)

    await expect(embed(model, { input: 'hello' })).rejects.toBe(error)
  })
})
