import { env } from 'node:process'

import { describe, expect, it } from 'vitest'

import { embed } from '../src'

const baseURL = env.XSAI_E2E_BASE_URL!
const model = env.XSAI_E2E_MODEL_EMBED!

describe('embed e2e', () => {
  it('embeds one input through the local Ollama Embeddings API', async () => {
    const result = await embed({ baseURL, input: 'The sky is blue.', model })

    expect(result.embedding.length).toBeGreaterThan(0)
    expect(result.embedding.every(Number.isFinite)).toBe(true)
    expect(result.usage.promptTokens).toBeGreaterThan(0)
    expect(result.usage.totalTokens).toBeGreaterThanOrEqual(result.usage.promptTokens)
  })

  it('embeds a batch through the local Ollama Embeddings API', async () => {
    const result = await embed({ baseURL, input: ['A cat.', 'A dog.'], model })

    expect(result.embeddings).toHaveLength(2)
    expect(result.embeddings[0]?.length).toBeGreaterThan(0)
    expect(result.embeddings[1]?.length).toBe(result.embeddings[0]?.length)
    expect(result.embeddings[0]).not.toEqual(result.embeddings[1])
  })
})
