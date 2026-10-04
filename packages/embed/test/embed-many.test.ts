import type { EmbeddingModel, EmbeddingModelOptions } from '../src'

import { describe, expect, it, vi } from 'vitest'

import { embedMany } from '../src'

describe('embedMany', () => {
  it('returns batch embeddings and usage from the model', async () => {
    const expected = {
      embeddings: [[1], [2]],
      usage: { promptTokens: 4, totalTokens: 4 },
    }
    const model = vi.fn<EmbeddingModel>().mockResolvedValue(expected)
    const options = {
      input: ['first', 'second'],
      providerOptions: { embeddings: { dimensions: 1 } },
      signal: new AbortController().signal,
    } satisfies EmbeddingModelOptions

    const result = await embedMany(model, options)

    expect(result).toEqual(expected)
    expect(model).toHaveBeenCalledExactlyOnceWith(options)
  })

  it('propagates model failures', async () => {
    const error = new Error('Embedding failed')
    const model = vi.fn<EmbeddingModel>().mockRejectedValue(error)

    await expect(embedMany(model, { input: ['first', 'second'] })).rejects.toBe(error)
  })
})
