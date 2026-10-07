import { describe, expect, it } from 'vitest'

import { listModels, models, retrieveModel } from '../src'

describe('models', () => {
  it('lists models from the OpenAI-compatible models endpoint', async () => {
    const wireModels = [{
      created: 1_700_000_000,
      id: 'qwen3.5:0.8b',
      object: 'model' as const,
      owned_by: 'library',
    }]
    const requests: Request[] = []
    const fetch = async (request: Request) => {
      requests.push(request)
      return Response.json({ data: wireModels, object: 'list' })
    }

    const result = await listModels(models({
      apiKey: 'secret',
      baseURL: 'https://example.com/v1',
      fetch,
      headers: { 'X-Custom': 'custom' },
    }))

    expect(result).toStrictEqual([{
      id: 'qwen3.5:0.8b',
      providerMetadata: { models: { created: 1_700_000_000, ownedBy: 'library' } },
    }])
    expect(requests).toHaveLength(1)
    expect(requests[0]?.url).toBe('https://example.com/v1/models')
    expect(requests[0]?.method).toBe('GET')
    expect(Object.fromEntries(requests[0].headers)).toEqual({ 'authorization': 'Bearer secret', 'x-custom': 'custom' })
  })

  it('retrieves one model from the OpenAI-compatible models endpoint', async () => {
    const model = {
      created: 1_700_000_000,
      id: 'qwen3.5:0.8b',
      object: 'model' as const,
      owned_by: 'library',
    }
    const requests: Request[] = []
    const fetch = async (request: Request) => {
      requests.push(request)
      return Response.json(model)
    }
    const abort = new AbortController()

    const result = await retrieveModel(models({
      apiKey: 'secret',
      baseURL: 'https://example.com/v1/',
      fetch,
    }), { id: model.id, signal: abort.signal })

    expect(result).toStrictEqual({
      id: 'qwen3.5:0.8b',
      providerMetadata: { models: { created: 1_700_000_000, ownedBy: 'library' } },
    })
    expect(requests).toHaveLength(1)
    expect(requests[0]?.url).toBe('https://example.com/v1/models/qwen3.5%3A0.8b')
    expect(requests[0]?.method).toBe('GET')
    expect(requests[0]?.headers.get('Authorization')).toBe('Bearer secret')
    abort.abort()
    expect(requests[0]?.signal.aborted).toBe(true)
  })

  it('preserves zero and empty reported values', async () => {
    const catalog = models({
      baseURL: 'https://example.com/v1/',
      fetch: async () => Response.json({
        data: [
          { created: 0, id: 'empty-values', object: 'model', owned_by: '', unknown: 'discard' },
        ],
        object: 'list',
      }),
    })

    await expect(catalog.list()).resolves.toStrictEqual([
      { id: 'empty-values', providerMetadata: { models: { created: 0, ownedBy: '' } } },
    ])
  })

  it('returns an empty model list without inventing entries', async () => {
    const catalog = models({
      baseURL: 'https://example.com/v1/',
      fetch: async () => Response.json({ data: [], object: 'list' }),
    })

    await expect(listModels(catalog)).resolves.toStrictEqual([])
  })

  it('retrieves different models with one factory and discards extra wire fields', async () => {
    const catalog = models({
      baseURL: 'https://example.com/v1/',
      fetch: async request => Response.json({
        created: 1_700_000_000,
        id: new URL(request.url).pathname.split('/').at(-1),
        object: 'model',
        owned_by: 'library',
        unknown: 'discard',
      }),
    })

    await expect(retrieveModel(catalog, { id: 'first-model' })).resolves.toStrictEqual({
      id: 'first-model',
      providerMetadata: { models: { created: 1_700_000_000, ownedBy: 'library' } },
    })
    await expect(retrieveModel(catalog, { id: 'second-model' })).resolves.toStrictEqual({
      id: 'second-model',
      providerMetadata: { models: { created: 1_700_000_000, ownedBy: 'library' } },
    })
  })

  it('treats a model identifier as one URL path segment', async () => {
    const requests: string[] = []
    const catalog = models({
      baseURL: 'https://example.com/v1/',
      fetch: async (request) => {
        requests.push(request.url)
        return Response.json({ created: 1_700_000_000, id: 'org/model?revision=1#fragment', object: 'model', owned_by: 'library' })
      },
    })

    await expect(retrieveModel(catalog, { id: 'org/model?revision=1#fragment' })).resolves.toMatchObject({ id: 'org/model?revision=1#fragment' })
    expect(requests).toStrictEqual(['https://example.com/v1/models/org%2Fmodel%3Frevision%3D1%23fragment'])
  })

  it('preserves a model-not-found HTTP error without retrying', async () => {
    let calls = 0
    const catalog = models({
      baseURL: 'https://example.com/v1/',
      fetch: async () => {
        calls++
        return new Response('model not found', { status: 404 })
      },
    })

    await expect(retrieveModel(catalog, { id: 'missing-model' })).rejects.toMatchObject({
      body: 'model not found',
      code: 'http-error',
      status: 404,
    })
    expect(calls).toBe(1)
  })

  it('preserves list HTTP errors', async () => {
    const catalog = models({
      baseURL: 'https://example.com/v1/',
      fetch: async () => new Response('rate limited', { status: 429 }),
    })

    await expect(listModels(catalog)).rejects.toMatchObject({ body: 'rate limited', code: 'http-error', status: 429 })
  })

  it('preserves the cause of connection failures', async () => {
    const cause = new Error('Connection refused')
    const catalog = models({
      baseURL: 'https://example.com/v1/',
      fetch: async () => { throw cause },
    })

    await expect(listModels(catalog)).rejects.toMatchObject({ cause, code: 'network-error' })
  })

  it('preserves cancellation for both operations', async () => {
    const reason = new Error('Stop model request')
    const signal = AbortSignal.abort(reason)
    const catalog = models({
      baseURL: 'https://example.com/v1/',
      fetch: async (request) => {
        request.signal.throwIfAborted()
        throw new Error('Unexpected request')
      },
    })

    await expect(listModels(catalog, { signal })).rejects.toBe(reason)
    await expect(retrieveModel(catalog, { id: 'some-model', signal })).rejects.toBe(reason)
  })
})
