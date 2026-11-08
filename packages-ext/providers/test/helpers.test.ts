/* eslint-disable no-template-curly-in-string -- models.dev base URLs contain ${VAR} templates. */
import type { Model, Provider, Route } from '../src/types'

import { describe, expect, it, vi } from 'vitest'

import { accepts, route } from '../src'
import { decisionModel } from '../src/decide'
import { embeddingModel } from '../src/embed'
import { languageModel } from '../src/text'

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

describe('helpers', () => {
  it('prefers Responses, then Messages, then Chat Completions', async () => {
    const { fetch, requests } = capture()
    await expect(languageModel(provider, 'all', { fetch })({ input: 'hi' })).rejects.toThrow()
    await expect(languageModel(provider, 'all', { fetch, protocol: 'messages' })({ input: 'hi', maxOutputTokens: 5 })).rejects.toThrow()
    await expect(languageModel(provider, 'chat-only', { fetch })({ input: 'hi' })).rejects.toThrow()

    expect(requests.map(r => r.url)).toEqual([
      'https://api.example.com/v1/responses',
      'https://api.example.com/anthropic/v1/messages',
      'https://api.example.com/v1/chat/completions',
    ])
  })

  it('passes auth, headers, and the route path to the adapter', async () => {
    const { fetch, requests } = capture()
    await expect(decisionModel(provider, 'decider', { apiKey: 'key', fetch, headers: { 'x-extra': '1' } })({
      input: 'hi',
      questions: { ok: { instructions: 'Is it ok?', type: 'boolean' } },
    })).rejects.toThrow()

    expect(requests[0].url).toBe('https://api.example.com/v1/decisions')
    expect(requests[0].headers.get('authorization')).toBe('Bearer key')
    expect(requests[0].headers.get('x-extra')).toBe('1')
  })

  it('throws before fetch when the model has no route for the helper', () => {
    const { fetch } = capture()
    expect(() => embeddingModel(provider, 'all', { fetch })).toThrow('No embeddings route for model all on provider example')
    expect(() => languageModel(provider, 'chat-only', { fetch, protocol: 'responses' })).toThrow('No responses route')
    expect(fetch).not.toHaveBeenCalled()
  })
})
