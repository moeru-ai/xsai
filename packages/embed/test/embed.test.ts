import type { EmbeddingModel, EmbeddingModelOptions } from '../src'

import { describe, expect, it, vi } from 'vitest'

import { embed } from '../src'

describe('embed', () => {
  it.each([false, true])('returns the first embedding and usage for a string input (async: %s)', async (isAsync) => {
    const expected = {
      embeddings: [[0.25, -0.5], [1, 2]],
      usage: { inputTokens: 3, totalTokens: 3 },
    }
    const model = isAsync
      ? vi.fn<EmbeddingModel>().mockResolvedValue(expected)
      : vi.fn<EmbeddingModel>().mockReturnValue(expected)
    const options = {
      input: 'hello',
      providerOptions: { embeddings: { dimensions: 2 } },
      signal: new AbortController().signal,
    } satisfies EmbeddingModelOptions

    const result = await embed(model, options)

    expect(result).toEqual({ embedding: [0.25, -0.5], usage: { inputTokens: 3, totalTokens: 3 } })
    expect(model).toHaveBeenCalledExactlyOnceWith(options)
  })

  it('accepts a model result without usage', async () => {
    await expect(embed(() => ({ embeddings: [[1, 2]] }), { input: 'hello' }))
      .resolves
      .toEqual({ embedding: [1, 2] })
  })

  it.each([false, true])('rejects an empty embedding result (async: %s)', async (isAsync) => {
    const result = { embeddings: [] }
    const model = isAsync
      ? vi.fn<EmbeddingModel>().mockResolvedValue(result)
      : vi.fn<EmbeddingModel>().mockReturnValue(result)

    await expect(embed(model, { input: 'hello' })).rejects.toMatchObject({ code: 'invalid-response' })
  })

  it.each([false, true])('propagates model failures (async: %s)', async (isAsync) => {
    const error = new Error('Embedding failed')
    const model = isAsync
      ? vi.fn<EmbeddingModel>().mockRejectedValue(error)
      : vi.fn<EmbeddingModel>().mockImplementation(() => { throw error })

    await expect(embed(model, { input: 'hello' })).rejects.toBe(error)
  })
})
