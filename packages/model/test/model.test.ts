import { describe, expect, it } from 'vitest'

import { listModels, retrieveModel } from '../src'

describe('model', () => {
  it('lists models from the OpenAI-compatible models endpoint', async () => {
    const models = [{
      created: 1_700_000_000,
      id: 'qwen3.5:0.8b',
      object: 'model' as const,
      owned_by: 'library',
    }]
    const requests: { init?: RequestInit, input: Request | string | URL }[] = []
    const fetch: typeof globalThis.fetch = async (input, init) => {
      requests.push({ init, input })
      return Response.json({ data: models, object: 'list' })
    }

    const result = await listModels({
      apiKey: 'secret',
      baseURL: 'https://example.com/v1',
      fetch,
    })

    expect(result).toEqual(models)
    expect(requests).toHaveLength(1)
    expect(requests[0]?.input.toString()).toBe('https://example.com/v1/models')
    expect(requests[0]?.init).toMatchObject({
      headers: { Authorization: 'Bearer secret' },
      method: 'GET',
    })
  })

  it('retrieves one model from the OpenAI-compatible models endpoint', async () => {
    const model = {
      created: 1_700_000_000,
      id: 'qwen3.5:0.8b',
      object: 'model' as const,
      owned_by: 'library',
    }
    const requests: { init?: RequestInit, input: Request | string | URL }[] = []
    const fetch: typeof globalThis.fetch = async (input, init) => {
      requests.push({ init, input })
      return Response.json(model)
    }

    const result = await retrieveModel({
      apiKey: 'secret',
      baseURL: 'https://example.com/v1/',
      fetch,
      model: model.id,
    })

    expect(result).toEqual(model)
    expect(requests).toHaveLength(1)
    expect(requests[0]?.input.toString()).toBe('https://example.com/v1/models/qwen3.5:0.8b')
    expect(requests[0]?.init).toMatchObject({
      headers: { Authorization: 'Bearer secret' },
      method: 'GET',
    })
  })
})
