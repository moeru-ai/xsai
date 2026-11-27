import type { Provider } from '../src/types'

import { describe, expect, it, vi } from 'vitest'

import { applyCorrections } from '../src/corrections'
import { CATALOG_URL, fetchProviders } from '../src/fetch'
import { normalizeCatalog } from '../src/normalize'

const model = (id: string, extra: Record<string, unknown> = {}) => ({
  api: { 'chat-completions': { base_url: 'https://api.example.com/v1' } },
  capabilities: { reasoning: { supported: false }, tools: { supported: true } },
  description: `About ${id}`,
  id,
  limit: { context: 1000 },
  modalities: { input: ['text'], output: ['text'] },
  name: id,
  type: 'chat',
  ...extra,
})

const catalog = {
  'example': { doc: 'https://example.com', env: ['EXAMPLE_API_KEY'], id: 'example', models: { bad: model('bad', { limit: 'none' }), m1: model('m1') }, name: 'Example' },
  'google-vertex': { doc: 'https://vertex.example.com', env: ['GOOGLE_APPLICATION_CREDENTIALS'], id: 'google-vertex', models: { m1: model('m1') }, name: 'Vertex' },
}

const respond = (response: Response) => {
  const requests: Request[] = []
  const fetch = vi.fn(async (request: Request) => {
    requests.push(request)
    return response
  })
  return { fetch, requests }
}

describe('fetchProviders', () => {
  it('normalizes the catalog with descriptions and corrections, skipping invalid entries', async () => {
    const { fetch, requests } = respond(Response.json(catalog, { headers: { etag: '"v1"' } }))
    const result = await fetchProviders({ fetch })

    expect(requests[0].url).toBe(CATALOG_URL)
    expect(requests[0].headers.has('if-none-match')).toBe(false)
    expect(result.notModified).toBe(false)
    if (result.notModified)
      return
    expect(result.etag).toBe('"v1"')
    expect(Object.keys(result.providers)).toEqual(['example', 'google-vertex', 'litellm', 'ollama'])
    expect(Object.keys(result.providers.example.models)).toEqual(['m1'])
    expect(result.providers.example.models.m1.description).toBe('About m1')
    expect(result.providers['google-vertex'].apiKeyEnv).toEqual([])
  })

  it('revalidates with the previous ETag and returns notModified without parsing', async () => {
    const { fetch, requests } = respond(new Response(null, { status: 304 }))

    await expect(fetchProviders({ etag: '"v1"', fetch, url: 'https://mirror.example.com/api.json' })).resolves.toEqual({ notModified: true })
    expect(requests[0].url).toBe('https://mirror.example.com/api.json')
    expect(requests[0].headers.get('if-none-match')).toBe('"v1"')
  })

  it('throws on HTTP errors and catalogs without valid providers', async () => {
    await expect(fetchProviders({ fetch: respond(new Response('', { status: 503 })).fetch })).rejects.toThrow('HTTP 503')
    await expect(fetchProviders({ fetch: respond(Response.json([])).fetch })).rejects.toThrow('catalog: expected an object')
    await expect(fetchProviders({ fetch: respond(Response.json({ example: {} })).fetch })).rejects.toThrow('catalog: no valid provider')
  })
})

describe('applyCorrections', () => {
  const local: Provider = { doc: 'https://local.example.com', env: [], id: 'example', models: {}, name: 'Local' }

  it('skips unknown overrides and lets models.dev win over extra providers unless strict', () => {
    const providers = normalizeCatalog({ example: catalog.example })
    const corrected = applyCorrections(providers, { extra: [local], overrides: { missing: { name: 'Missing' } } })

    expect(Object.keys(corrected)).toEqual(['example'])
    expect(corrected.example.name).toBe('Example')
    expect(() => applyCorrections(providers, { extra: [local], overrides: {}, strict: true })).toThrow('Extra provider clashes with models.dev: example')
    expect(() => applyCorrections(providers, { extra: [], overrides: { missing: {} }, strict: true })).toThrow('Override for unknown provider: missing')
  })
})
