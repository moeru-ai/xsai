import { describe, expect, it } from 'vitest'

import { embed } from '../src'

describe('embed', () => {
  it('returns one embedding and usage for a string input', async () => {
    const requests: { init?: RequestInit, input: Request | string | URL }[] = []
    const fetch: typeof globalThis.fetch = async (input, init) => {
      requests.push({ init, input })
      return Response.json({
        data: [{ embedding: [0.25, -0.5], index: 0 }],
        usage: { prompt_tokens: 3, total_tokens: 3 },
      })
    }

    const result = await embed({
      apiKey: 'secret',
      baseURL: 'https://example.com/v1',
      dimensions: 2,
      fetch,
      input: 'hello',
      model: 'embedding-model',
    })

    expect(result).toEqual({ embedding: [0.25, -0.5], usage: { promptTokens: 3, totalTokens: 3 } })
    expect(requests).toHaveLength(1)
    expect(requests[0]?.input.toString()).toBe('https://example.com/v1/embeddings')
    expect(requests[0]?.init).toMatchObject({
      body: JSON.stringify({ dimensions: 2, input: 'hello', model: 'embedding-model' }),
      headers: { 'Authorization': 'Bearer secret', 'Content-Type': 'application/json' },
      method: 'POST',
    })
  })

  it('returns batch embeddings in input order', async () => {
    const fetch: typeof globalThis.fetch = async () => Response.json({
      data: [
        { embedding: [2], index: 1 },
        { embedding: [1], index: 0 },
      ],
      usage: { prompt_tokens: 4, total_tokens: 4 },
    })

    const result = await embed({
      baseURL: 'https://example.com/v1/',
      fetch,
      input: ['first', 'second'],
      model: 'embedding-model',
    })

    expect(result).toEqual({ embeddings: [[1], [2]], usage: { promptTokens: 4, totalTokens: 4 } })
  })
})
