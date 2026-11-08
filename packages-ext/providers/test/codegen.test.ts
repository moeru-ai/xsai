import type { Provider } from '../src/types'

import { describe, expect, it } from 'vitest'

import { buildProviders, exportName, factoryName, renderClient, renderFull, renderModels } from '../scripts/codegen'

const catalog = (...ids: string[]) => Object.fromEntries(ids.map(id => [id, {
  doc: `https://${id}.example.com/docs`,
  env: [],
  id,
  models: {
    m1: {
      api: { 'chat-completions': { base_url: `https://${id}.example.com/v1` } },
      capabilities: { reasoning: { supported: false }, tools: { supported: true } },
      id: 'm1',
      limit: { context: 1000 },
      modalities: { input: ['text'], output: ['text'] },
      name: 'Model 1',
      type: 'chat',
    },
  },
  name: id,
}]))

const extraProvider: Provider = {
  defaults: { chat: { baseURL: 'http://localhost:1234/v1/' } },
  doc: 'https://local.example.com',
  env: [],
  id: 'local',
  models: {},
  name: 'Local',
}

describe('exportName', () => {
  it.each([
    ['deepseek', 'deepseek'],
    ['amazon-bedrock', 'amazonBedrock'],
    ['wafer.ai', 'waferAi'],
    ['302ai', '_302ai'],
  ])('maps %s to %s', (id, name) => {
    expect(exportName(id)).toBe(name)
  })

  it.each([
    ['openai', 'createOpenai'],
    ['amazon-bedrock', 'createAmazonBedrock'],
    ['302ai', 'create302ai'],
  ])('names the factory for %s %s', (id, name) => {
    expect(factoryName(id)).toBe(name)
  })
})

describe('buildProviders', () => {
  it('sorts providers and adds extra providers', () => {
    const providers = buildProviders(catalog('zeta', 'alpha'), { extra: [extraProvider], overrides: {} })

    expect(providers.map(({ id }) => id)).toEqual(['alpha', 'local', 'zeta'])
    expect(providers[0].defaults).toEqual({ chat: { baseURL: 'https://alpha.example.com/v1' } })
  })

  it('deep-merges overrides and recomputes defaults', () => {
    const [alpha] = buildProviders(catalog('alpha'), {
      extra: [],
      overrides: {
        alpha: {
          apiKeyEnv: [],
          defaults: { responses: { baseURL: 'https://alpha.example.com/v2' } },
          models: { m1: { routes: { chat: { baseURL: 'https://fixed.example.com/v1' } } } },
        },
      },
    })

    expect(alpha.models.m1.routes.chat).toMatchObject({ baseURL: 'https://fixed.example.com/v1', protocol: 'chat' })
    expect(alpha.models.m1.name).toBe('Model 1')
    expect(alpha.apiKeyEnv).toEqual([])
    expect(alpha.defaults).toEqual({
      chat: { baseURL: 'https://fixed.example.com/v1' },
      responses: { baseURL: 'https://alpha.example.com/v2' },
    })
  })

  it.each([
    [catalog('full'), {}, [], 'Provider ID matches a reserved subpath: full'],
    [catalog('create'), {}, [], 'Provider ID matches a reserved subpath: create'],
    [catalog('a-b', 'a.b'), {}, [], 'Providers a-b and a.b share the export name aB'],
    [catalog('local'), {}, [extraProvider], 'Extra provider clashes with models.dev: local'],
    [catalog('alpha'), { beta: {} }, [], 'Override for unknown provider: beta'],
  ])('rejects invalid input (%#)', (input, overrides, extra, message) => {
    expect(() => buildProviders(input, { extra, overrides })).toThrow(message)
  })

  it('fails on any invalid entry', () => {
    const input = catalog('alpha')
    input.alpha.models.m1.limit = 'none' as never
    expect(() => buildProviders(input, { extra: [], overrides: {} })).toThrow('alpha.models.m1.limit')
  })
})

describe('render', () => {
  it('renders a models module with literal model IDs and a type-only import', () => {
    const [alpha] = buildProviders(catalog('302ai'), { extra: [], overrides: {} })
    const source = renderModels(alpha)

    expect(source.match(/^import .*$/gm)).toEqual(['import type { Provider } from \'../types\''])
    expect(source).toContain('export const _302ai: Provider<"m1"> = {')
    expect(source).toContain('    "m1": {"capabilities":')
    expect(renderModels(extraProvider)).toContain('export const local: Provider<never> = {')
  })

  it('renders a client module with routes only', () => {
    const [alpha] = buildProviders(catalog('302ai'), { extra: [], overrides: {} })
    const source = renderClient(alpha)

    expect(source).toContain('type Model = "m1"')
    expect(source).toContain('    "m1": ["chat"],')
    expect(source).not.toContain('capabilities')
    expect(source).toContain('export const create302ai = (options?: ProviderOptions) => createClient(routes, options)')
    expect(source).toContain('export const _302ai = /* @__PURE__ */ create302ai()')
  })

  it('renders /full from the models modules, keyed by provider ID', () => {
    const source = renderFull([{ ...extraProvider, id: 'wafer.ai' }])

    expect(source).toContain('import { waferAi } from \'./models/wafer.ai\'')
    expect(source).toContain('  "wafer.ai": waferAi,')
  })
})
