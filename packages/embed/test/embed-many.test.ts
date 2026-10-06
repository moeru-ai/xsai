import type { EmbeddingModel, EmbeddingModelOptions } from '../src'

import { describe, expect, it, vi } from 'vitest'

import { embedMany } from '../src'

describe('embedMany', () => {
  it.each([false, true])('returns batch embeddings and usage from the model (async: %s)', async (isAsync) => {
    const expected = {
      embeddings: [[1], [2]],
      usage: { inputTokens: 4, totalTokens: 4 },
    }
    const model = isAsync
      ? vi.fn<EmbeddingModel>().mockResolvedValue(expected)
      : vi.fn<EmbeddingModel>().mockReturnValue(expected)
    const options = {
      input: ['first', 'second'],
      providerOptions: { embeddings: { dimensions: 1 } },
      signal: new AbortController().signal,
    } satisfies EmbeddingModelOptions

    const result = await embedMany(model, options)

    expect(result).toEqual(expected)
    expect(model).toHaveBeenCalledExactlyOnceWith(options)
  })

  it('accepts a model result without usage', async () => {
    const result = { embeddings: [[1], [2]] }
    await expect(embedMany(() => result, { input: ['first', 'second'] })).resolves.toBe(result)
  })

  it.each([false, true])('propagates model failures (async: %s)', async (isAsync) => {
    const error = new Error('Embedding failed')
    const model = isAsync
      ? vi.fn<EmbeddingModel>().mockRejectedValue(error)
      : vi.fn<EmbeddingModel>().mockImplementation(() => { throw error })

    await expect(embedMany(model, { input: ['first', 'second'] })).rejects.toBe(error)
  })
})
