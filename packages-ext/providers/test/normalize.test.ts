/* eslint-disable no-template-curly-in-string -- models.dev base URLs contain ${VAR} templates. */
import { describe, expect, it } from 'vitest'

import { normalizeCatalog } from '../src/normalize'

const model = (overrides: Record<string, unknown> = {}) => ({
  api: {
    'chat-completions': {
      base_url: 'https://api.example.com/v1',
      capabilities: { tools: { choice: ['auto', 'none'], freeform: ['text'], strict: true, updates: false } },
      compatibility: { max_tokens_field: 'max_completion_tokens' },
      sdk: { aisdk: '@ai-sdk/openai' },
    },
    'realtime': { base_url: 'wss://api.example.com/v1' },
    'responses': { base_url: 'https://api.example.com/v1' },
  },
  capabilities: {
    cache: { explicit: { ttl: ['5m'] }, implicit: true },
    effort_updates: false,
    reasoning: { default: { type: 'effort', value: 'medium' }, effort: ['low', 'medium', 'high'], supported: true },
    service_tier: ['flex', 'priority'],
    store: true,
    structured_output: true,
    system_updates: true,
    temperature: false,
    tools: { supported: true },
  },
  cost: {
    multipliers: [{ factor: { text: 2 }, when: { service_tier: { equals: 'priority' } } }],
    text: {
      input: { cache: { read: 0.1, write: { '1h': 2, '5m': 1.25 } }, price: 1 },
      output: { price: 4 },
    },
    web_search: { price: 10 },
  },
  description: 'A test model',
  family: 'test',
  id: 'm1',
  last_updated: '2026-01-01',
  limit: { context: 1000, output: 100 },
  modalities: { input: ['text', 'image/png'], output: ['text'] },
  name: 'Model 1',
  open_weights: false,
  release_date: '2026-01-01',
  type: 'chat',
  ...overrides,
})

const catalog = (models: Record<string, unknown>) => ({
  example: {
    doc: 'https://example.com/docs',
    env: ['EXAMPLE_API_KEY'],
    id: 'example',
    models,
    name: 'Example',
  },
})

describe('normalizeCatalog', () => {
  it('maps v2 fields to the normalized model', () => {
    const { example } = normalizeCatalog(catalog({ m1: model() }))

    expect(example).toStrictEqual({
      apiKeyEnv: ['EXAMPLE_API_KEY'],
      defaults: {
        chat: { baseURL: 'https://api.example.com/v1' },
        responses: { baseURL: 'https://api.example.com/v1' },
      },
      doc: 'https://example.com/docs',
      env: ['EXAMPLE_API_KEY'],
      id: 'example',
      models: {
        m1: {
          capabilities: {
            cache: { explicit: true, implicit: true },
            reasoning: {
              budget: undefined,
              default: { type: 'effort', value: 'medium' },
              efforts: ['low', 'medium', 'high'],
              supported: true,
              toggle: undefined,
            },
            serviceTiers: ['flex', 'priority'],
            structuredOutput: true,
            temperature: false,
            tools: { supported: true },
            topK: undefined,
            topP: undefined,
          },
          cost: { cacheRead: 0.1, cacheWrite: 2, input: 1, output: 4 },
          description: undefined,
          id: 'm1',
          limit: { context: 1000, input: undefined, output: 100 },
          modalities: { input: ['text', 'image/png'], output: ['text'] },
          name: 'Model 1',
          routes: {
            chat: {
              baseURL: 'https://api.example.com/v1',
              capabilities: { tools: { choice: ['auto', 'none'], strict: true } },
              compatibility: { maxTokensField: 'max_completion_tokens' },
              path: undefined,
              protocol: 'chat',
              variables: undefined,
            },
            responses: {
              baseURL: 'https://api.example.com/v1',
              capabilities: undefined,
              compatibility: undefined,
              path: undefined,
              protocol: 'responses',
              variables: undefined,
            },
          },
          status: undefined,
          type: 'chat',
        },
      },
      name: 'Example',
    })
  })

  it('keeps descriptions only when asked', () => {
    expect(normalizeCatalog(catalog({ m1: model() }), { description: true }).example.models.m1)
      .toMatchObject({ description: 'A test model' })
  })

  it('drops excluded model types and maps cache false to both modes off', () => {
    const { example } = normalizeCatalog(catalog({
      m1: model({ capabilities: { cache: false, reasoning: { supported: false }, tools: { supported: false } } }),
      v1: model({ id: 'v1', type: 'video' }),
    }))

    expect(Object.keys(example.models)).toEqual(['m1'])
    expect(example.models.m1.capabilities.cache).toEqual({ explicit: false, implicit: false })
  })

  it('strips the leading slash from paths, lists template variables, and keeps such routes out of defaults', () => {
    const { example } = normalizeCatalog(catalog({
      d1: model({
        api: { systemone: { base_url: 'https://${REGION}.example.com', path: '/v1/decisions' } },
        id: 'd1',
        type: 'decision',
      }),
    }))

    expect(example.models.d1.routes.systemone).toMatchObject({
      baseURL: 'https://${REGION}.example.com',
      path: 'v1/decisions',
      variables: ['REGION'],
    })
    expect(example.defaults).toBeUndefined()
  })

  it('gives no default when models disagree on the base URL', () => {
    const { example } = normalizeCatalog(catalog({
      m1: model(),
      m2: model({ api: { 'chat-completions': { base_url: 'https://other.example.com/v1' } }, id: 'm2' }),
    }))

    expect(example.defaults).toEqual({ responses: { baseURL: 'https://api.example.com/v1' } })
  })

  it('drops prices in other units than tokens', () => {
    const { example } = normalizeCatalog(catalog({
      s1: model({ cost: { text: { input: { price: 15, unit: 'character' } } }, id: 's1', type: 'speech' }),
    }))

    expect(example.models.s1.cost).toBeUndefined()
  })

  it('skips invalid models and routes unless strict', () => {
    const input = catalog({
      bad: model({ id: 'bad', limit: 'none' }),
      m1: model({ api: { 'chat-completions': { base_url: 1 }, 'responses': { base_url: 'https://api.example.com/v1' } } }),
    })

    const { example } = normalizeCatalog(input)
    expect(Object.keys(example.models)).toEqual(['m1'])
    expect(Object.keys(example.models.m1.routes)).toEqual(['responses'])
    expect(() => normalizeCatalog(input, { strict: true })).toThrow('example.models.bad.limit: expected an object')
  })

  it.each([
    [['EXAMPLE_KEY'], ['EXAMPLE_KEY']],
    [['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'REGION', 'AWS_BEARER_TOKEN_BEDROCK'], ['AWS_BEARER_TOKEN_BEDROCK']],
    [['REGION', 'EXAMPLE_API_KEY', 'EXAMPLE_PROJECT_ID'], ['EXAMPLE_API_KEY']],
    [['REGION'], undefined],
  ])('picks API key variables from %j', (env, apiKeyEnv) => {
    const input = catalog({ m1: model({ api: { 'chat-completions': { base_url: 'https://${REGION}.example.com' } } }) })
    input.example.env = env
    expect(normalizeCatalog(input).example.apiKeyEnv).toEqual(apiKeyEnv)
  })

  it('throws when no provider survives', () => {
    expect(() => normalizeCatalog([])).toThrow('catalog: expected an object')
    expect(() => normalizeCatalog({ example: { id: 'example' } })).toThrow('catalog: no valid provider')
  })
})
