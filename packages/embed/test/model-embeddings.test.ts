import { describe, expect, it } from 'vitest'

import { embeddings } from '../src'

describe('embeddings', () => {
  it('posts string input, dimensions and signal to the embeddings endpoint', async () => {
    const requests: { init?: RequestInit, input: Request | string | URL }[] = []
    const fetch: typeof globalThis.fetch = async (input, init) => {
      requests.push({ init, input })
      return Response.json({
        data: [{ embedding: [0.25, -0.5], index: 0 }],
        usage: { prompt_tokens: 3, total_tokens: 3 },
      })
    }
    const model = embeddings({
      apiKey: 'secret',
      baseURL: 'https://example.com/v1',
      fetch,
      headers: { 'X-Custom': 'custom' },
      model: 'embedding-model',
    })
    const signal = new AbortController().signal

    const result = await model({
      input: 'hello',
      providerOptions: { embeddings: { dimensions: 2 } },
      signal,
    })

    expect(result).toEqual({ embeddings: [[0.25, -0.5]], usage: { promptTokens: 3, totalTokens: 3 } })
    expect(requests).toHaveLength(1)
    expect(requests[0]?.input.toString()).toBe('https://example.com/v1/embeddings')
    expect(requests[0]?.init).toMatchObject({
      headers: { 'Authorization': 'Bearer secret', 'Content-Type': 'application/json', 'X-Custom': 'custom' },
      method: 'POST',
    })
    expect(requests[0]?.init?.signal).toBe(signal)
    expect(JSON.parse(requests[0].init!.body as string)).toEqual({
      dimensions: 2,
      input: 'hello',
      model: 'embedding-model',
    })
  })

  it('posts batch input without dimensions and returns embeddings in input order', async () => {
    const requests: { init?: RequestInit, input: Request | string | URL }[] = []
    const fetch: typeof globalThis.fetch = async (input, init) => {
      requests.push({ init, input })
      return Response.json({
        data: [
          { embedding: [3], index: 2 },
          { embedding: [1], index: 0 },
          { embedding: [2], index: 1 },
        ],
        usage: { prompt_tokens: 6, total_tokens: 6 },
      })
    }
    const model = embeddings({
      baseURL: 'https://example.com/v1/',
      fetch,
      model: 'embedding-model',
    })

    const result = await model({ input: ['first', 'second', 'third'] })

    expect(result).toEqual({ embeddings: [[1], [2], [3]], usage: { promptTokens: 6, totalTokens: 6 } })
    expect(requests).toHaveLength(1)
    expect(requests[0]?.input.toString()).toBe('https://example.com/v1/embeddings')
    expect(JSON.parse(requests[0].init!.body as string)).toEqual({
      input: ['first', 'second', 'third'],
      model: 'embedding-model',
    })
  })

  it('propagates HTTP errors', async () => {
    const model = embeddings({
      baseURL: 'https://example.com/v1/',
      fetch: async () => new Response('rate limited', { status: 429 }),
      model: 'embedding-model',
    })

    await expect(model({ input: 'hello' })).rejects.toMatchObject({
      body: 'rate limited',
      code: 'http-error',
      status: 429,
    })
  })

  it('preserves the cause of connection failures', async () => {
    const cause = new Error('Connection refused')
    const model = embeddings({
      baseURL: 'https://example.com/v1/',
      fetch: async () => { throw cause },
      model: 'embedding-model',
    })

    await expect(model({ input: 'hello' })).rejects.toMatchObject({ cause, code: 'network-error' })
  })

  it('preserves the abort reason when fetch rejects', async () => {
    const reason = new Error('Embedding cancelled')
    const signal = AbortSignal.abort(reason)
    const model = embeddings({
      baseURL: 'https://example.com/v1/',
      fetch: async (_, init) => {
        init!.signal!.throwIfAborted()
        throw new Error('Expected an aborted signal')
      },
      model: 'embedding-model',
    })

    await expect(model({ input: 'hello', signal })).rejects.toBe(reason)
  })
})
