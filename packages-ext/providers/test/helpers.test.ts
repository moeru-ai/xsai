/* eslint-disable no-template-curly-in-string -- models.dev base URLs contain ${VAR} templates. */
import type { Model, Provider, Route } from '../src/types'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { accepts, route } from '../src'
import { createProvider } from '../src/create'

const model = (id: string, routes: Route[], input = ['text']): Model => ({
  capabilities: { reasoning: { supported: false }, tools: { supported: true } },
  id,
  limit: {},
  modalities: { input, output: ['text'] },
  name: id,
  routes: Object.fromEntries(routes.map(r => [r.protocol, r])),
  type: 'chat',
})

const provider: Provider<'all' | 'chat-only' | 'decider' | 'regional'> = {
  apiKeyEnv: ['EXAMPLE_API_KEY'],
  defaults: { chat: { baseURL: 'https://default.example.com/v1' } },
  doc: 'https://example.com',
  env: ['EXAMPLE_API_KEY'],
  id: 'example',
  models: {
    'all': model('all', [
      { baseURL: 'https://api.example.com/v1', protocol: 'chat' },
      { baseURL: 'https://api.example.com/anthropic/v1', protocol: 'messages' },
      { baseURL: 'https://api.example.com/v1', protocol: 'responses' },
    ], ['text', 'image/png']),
    'chat-only': model('chat-only', [{ baseURL: 'https://api.example.com/v1', protocol: 'chat' }], ['image/*']),
    'decider': model('decider', [{ baseURL: 'https://api.example.com', path: 'v1/decisions', protocol: 'systemone' }]),
    'regional': model('regional', [{ baseURL: 'https://${REGION}.example.com/v1', protocol: 'chat', variables: ['REGION'] }]),
  },
  name: 'Example',
}

const capture = () => {
  const requests: Request[] = []
  const fetch = vi.fn(async (request: Request) => {
    requests.push(request)
    return new Response('{}', { status: 500 })
  })
  return { fetch, requests }
}

describe('route', () => {
  it('returns the first protocol the model has a route for', () => {
    expect(route(provider, 'chat-only', ['responses', 'chat'])).toEqual({
      baseURL: 'https://api.example.com/v1',
      model: 'chat-only',
      path: undefined,
      protocol: 'chat',
    })
  })

  it('uses provider defaults only for models outside the catalog', () => {
    expect(route(provider, 'new-model', 'chat')).toMatchObject({ baseURL: 'https://default.example.com/v1', model: 'new-model' })
    expect(() => route(provider, 'decider', 'chat')).toThrow('No chat route for model decider on provider example')
  })

  it('fills template variables and throws when one is missing', () => {
    expect(route(provider, 'regional', 'chat', { variables: { REGION: 'eu' } }).baseURL).toBe('https://eu.example.com/v1')
    expect(() => route(provider, 'regional', 'chat')).toThrow('Missing variable REGION for provider example')
  })
})

describe('accepts', () => {
  it('matches exact types and wildcards on either side', () => {
    expect(accepts(provider.models.all, 'image/png')).toBe(true)
    expect(accepts(provider.models.all, 'image/*')).toBe(true)
    expect(accepts(provider.models['chat-only'], 'image/webp')).toBe(true)
    expect(accepts(provider.models.all, 'audio/wav')).toBe(false)
  })
})

describe('createProvider', () => {
  afterEach(() => vi.unstubAllEnvs())

  it('prefers Chat Completions unless the provider data sets an order', async () => {
    const { fetch, requests } = capture()
    const client = createProvider(provider, { fetch })
    await expect(client.text('all')({ input: 'hi' })).rejects.toThrow()
    await expect(client.text('all', { protocol: 'messages' })({ input: 'hi', maxOutputTokens: 5 })).rejects.toThrow()
    await expect(createProvider({ ...provider, protocols: ['responses'] }, { fetch }).text('all')({ input: 'hi' })).rejects.toThrow()

    expect(requests.map(r => r.url)).toEqual([
      'https://api.example.com/v1/chat/completions',
      'https://api.example.com/anthropic/v1/messages',
      'https://api.example.com/v1/responses',
    ])
  })

  it('merges model defaults into every call, with call options winning', async () => {
    const { fetch, requests } = capture()
    const model = createProvider(provider, { fetch }).text('all', {
      providerOptions: { chat: { seed: 1, topK: 5 } },
      temperature: 0.2,
    })
    await expect(model({ input: 'hi' })).rejects.toThrow()
    await expect(model({ input: 'hi', providerOptions: { chat: { seed: 2 } }, temperature: 1 })).rejects.toThrow()

    const bodies = await Promise.all(requests.map(async r => r.json() as Promise<Record<string, unknown>>))
    expect(bodies.map(({ seed, temperature, top_k }) => ({ seed, temperature, top_k }))).toEqual([
      { seed: 1, temperature: 0.2, top_k: 5 },
      { seed: 2, temperature: 1, top_k: 5 },
    ])
  })

  it('passes auth, headers, and the route path to the adapter', async () => {
    const { fetch, requests } = capture()
    await expect(createProvider(provider, { apiKey: 'key', fetch, headers: { 'x-extra': '1' } }).decision('decider')({
      input: 'hi',
      questions: { ok: { instructions: 'Is it ok?', type: 'boolean' } },
    })).rejects.toThrow()

    expect(requests[0].url).toBe('https://api.example.com/v1/decisions')
    expect(requests[0].headers.get('authorization')).toBe('Bearer key')
    expect(requests[0].headers.get('x-extra')).toBe('1')
  })

  it('reads the API key and variables from the environment unless given', async () => {
    vi.stubEnv('EXAMPLE_API_KEY', 'env-key')
    vi.stubEnv('REGION', 'us')
    const { fetch, requests } = capture()
    await expect(createProvider(provider, { fetch }).text('regional')({ input: 'hi' })).rejects.toThrow()
    await expect(createProvider(provider, { apiKey: 'key', fetch, variables: { REGION: 'eu' } }).text('regional')({ input: 'hi' })).rejects.toThrow()

    expect(requests.map(r => [r.url, r.headers.get('authorization')])).toEqual([
      ['https://us.example.com/v1/chat/completions', 'Bearer env-key'],
      ['https://eu.example.com/v1/chat/completions', 'Bearer key'],
    ])
  })

  it('replaces the route base URL and keeps its path', async () => {
    const { fetch, requests } = capture()
    const client = createProvider(provider, { baseURL: 'https://gpu-box.example.com:8000/', fetch })
    await expect(client.decision('decider')({
      input: 'hi',
      questions: { ok: { instructions: 'Is it ok?', type: 'boolean' } },
    })).rejects.toThrow()
    await expect(client.text('new-model')({ input: 'hi' })).rejects.toThrow()

    expect(requests.map(r => r.url)).toEqual([
      'https://gpu-box.example.com:8000/v1/decisions',
      'https://gpu-box.example.com:8000/chat/completions',
    ])
  })

  it('throws before fetch when the model has no route for the method', () => {
    const { fetch } = capture()
    const client = createProvider(provider, { fetch })
    expect(() => client.embedding('all')).toThrow(expect.objectContaining({
      code: 'invalid-input',
      message: 'No embeddings route for model all on provider example',
    }))
    expect(() => client.text('chat-only', { protocol: 'responses' })).toThrow('No responses route')
    expect(() => client.text('regional')).toThrow('Missing variable REGION for provider example')
    expect(fetch).not.toHaveBeenCalled()
  })
})
