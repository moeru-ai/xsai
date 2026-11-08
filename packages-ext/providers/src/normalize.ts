import type { Cost, Model, ModelCapabilities, ModelType, Protocol, Provider, Route, RuntimeModel, RuntimeProvider } from './types'

export interface NormalizeOptions {
  /** Keeps model descriptions. Generated modules drop them. */
  description?: boolean
  /** Throws on the first invalid entry instead of skipping it. */
  strict?: boolean
}

const PROTOCOLS: Partial<Record<string, Protocol>> = {
  'chat-completions': 'chat',
  'decisions': 'decisions',
  'embeddings': 'embeddings',
  'images': 'generations',
  'messages': 'messages',
  'responses': 'responses',
  'speech': 'speech',
  'systemone': 'systemone',
  'transcriptions': 'transcriptions',
}

const MODEL_TYPES = new Set<string>(['chat', 'decision', 'embedding', 'image', 'speech', 'transcription'] satisfies ModelType[])
const MODEL_STATUSES = new Set<string>(['alpha', 'beta', 'deprecated'])

class InvalidEntryError extends TypeError {}

const fail = (path: string, expected: string): never => {
  throw new InvalidEntryError(`${path}: expected ${expected}`)
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const record = (value: unknown, path: string) => isRecord(value) ? value : fail(path, 'an object')
const string = (value: unknown, path: string) => typeof value === 'string' ? value : fail(path, 'a string')
const number = (value: unknown, path: string) => typeof value === 'number' && Number.isFinite(value) ? value : fail(path, 'a number')
const boolean = (value: unknown, path: string) => typeof value === 'boolean' ? value : fail(path, 'a boolean')
const strings = (value: unknown, path: string) => Array.isArray(value)
  ? value.map((item, index) => string(item, `${path}[${index}]`))
  : fail(path, 'an array of strings')

const optional = <T>(value: unknown, path: string, decode: (value: unknown, path: string) => T): T | undefined =>
  value === undefined ? undefined : decode(value, path)

/** Drops `undefined` fields and returns `undefined` for an empty object. */
const compact = <T extends object>(value: T): T | undefined => {
  const entries = Object.entries(value).filter(([, item]) => item !== undefined)
  return entries.length === 0 ? undefined : Object.fromEntries(entries) as T
}

/** Runs `decode` and, unless strict, returns `undefined` for an invalid entry. */
const attempt = <T>(decode: () => T, options: NormalizeOptions): T | undefined => {
  try {
    return decode()
  }
  catch (error) {
    if (options.strict === true || !(error instanceof InvalidEntryError))
      throw error
    return undefined
  }
}

const decodeCacheMode = (value: unknown, path: string) => typeof value === 'boolean'
  ? value
  : (record(value, path), true)

const decodeCapabilities = (value: unknown, path: string): ModelCapabilities => {
  const capabilities = record(value, path)
  const reasoning = record(capabilities.reasoning, `${path}.reasoning`)
  const tools = record(capabilities.tools, `${path}.tools`)

  return {
    cache: optional(capabilities.cache, `${path}.cache`, (cache, cachePath) => {
      if (cache === false)
        return { explicit: false, implicit: false }
      const modes = record(cache, cachePath)
      return {
        explicit: optional(modes.explicit, `${cachePath}.explicit`, decodeCacheMode),
        implicit: optional(modes.implicit, `${cachePath}.implicit`, decodeCacheMode),
      }
    }),
    reasoning: {
      budget: optional(reasoning.budget, `${path}.reasoning.budget`, (budget, budgetPath) => {
        const { max, min } = record(budget, budgetPath)
        return {
          max: optional(max, `${budgetPath}.max`, number),
          min: optional(min, `${budgetPath}.min`, number),
        }
      }),
      default: optional(reasoning.default, `${path}.reasoning.default`, (fallback, defaultPath) => {
        const { type, value } = record(fallback, defaultPath)
        return {
          type: string(type, `${defaultPath}.type`),
          value: typeof value === 'boolean' ? value : string(value, `${defaultPath}.value`),
        }
      }),
      efforts: optional(reasoning.effort, `${path}.reasoning.effort`, strings),
      supported: boolean(reasoning.supported, `${path}.reasoning.supported`),
      toggle: optional(reasoning.toggle, `${path}.reasoning.toggle`, boolean),
    },
    serviceTiers: optional(capabilities.service_tier, `${path}.service_tier`, strings),
    structuredOutput: optional(capabilities.structured_output, `${path}.structured_output`, boolean),
    temperature: optional(capabilities.temperature, `${path}.temperature`, boolean),
    tools: { supported: boolean(tools.supported, `${path}.tools.supported`) },
    topK: optional(capabilities.top_k, `${path}.top_k`, boolean),
    topP: optional(capabilities.top_p, `${path}.top_p`, boolean),
  }
}

/** USD per million text tokens. Prices in other units are dropped. */
const decodeCost = (value: unknown, path: string): Cost | undefined => {
  const text = record(value, path).text
  if (text === undefined)
    return undefined
  const { input, output } = record(text, `${path}.text`)
  const tokenPrice = (side: unknown, sidePath: string) => {
    if (side === undefined)
      return undefined
    const price = record(side, sidePath)
    return price.unit === undefined ? price : undefined
  }
  const inputPrice = tokenPrice(input, `${path}.text.input`)
  const outputPrice = tokenPrice(output, `${path}.text.output`)
  const cache = optional(inputPrice?.cache, `${path}.text.input.cache`, record)

  return compact({
    cacheRead: optional(cache?.read, `${path}.text.input.cache.read`, number),
    cacheWrite: optional(cache?.write, `${path}.text.input.cache.write`, (write, writePath) => typeof write === 'number'
      ? number(write, writePath)
      : number(Object.values(record(write, writePath))[0], writePath)),
    input: optional(inputPrice?.price, `${path}.text.input.price`, number),
    output: optional(outputPrice?.price, `${path}.text.output.price`, number),
  })
}

const decodeRoute = (protocol: Protocol, value: unknown, path: string): Route => {
  const route = record(value, path)
  const baseURL = string(route.base_url, `${path}.base_url`)
  const tools = optional(route.capabilities, `${path}.capabilities`, record)?.tools
  const compatibility = optional(route.compatibility, `${path}.compatibility`, record)
  const variables = [...new Set(Array.from(baseURL.matchAll(/\$\{(\w+)\}/g), match => match[1]))]

  return {
    baseURL,
    capabilities: compact({
      tools: optional(tools, `${path}.capabilities.tools`, (toolsValue, toolsPath) => {
        const { choice, strict } = record(toolsValue, toolsPath)
        return compact({
          choice: optional(choice, `${toolsPath}.choice`, strings),
          strict: optional(strict, `${toolsPath}.strict`, boolean),
        })
      }),
    }),
    compatibility: compatibility === undefined
      ? undefined
      : compact({
          maxTokensField: optional(compatibility.max_tokens_field, `${path}.compatibility.max_tokens_field`, string),
          mediaInput: optional(compatibility.media_input, `${path}.compatibility.media_input`, string),
          reasoningField: optional(compatibility.reasoning_field, `${path}.compatibility.reasoning_field`, string),
        }),
    // `HttpOptions.path` follows URL rules, so a leading `/` would drop the base URL path.
    path: optional(route.path, `${path}.path`, string)?.replace(/^\/+/, ''),
    protocol,
    variables: variables.length === 0 ? undefined : variables,
  }
}

const decodeModel = (value: unknown, path: string, options: NormalizeOptions): RuntimeModel | undefined => {
  const model = record(value, path)
  const type = string(model.type, `${path}.type`)
  if (!MODEL_TYPES.has(type))
    return undefined

  const status = optional(model.status, `${path}.status`, string)
  if (status !== undefined && !MODEL_STATUSES.has(status))
    fail(`${path}.status`, 'alpha, beta, or deprecated')

  const routes: Partial<Record<Protocol, Route>> = {}
  for (const [key, route] of Object.entries(record(model.api, `${path}.api`))) {
    const protocol = PROTOCOLS[key]
    if (protocol === undefined)
      continue
    const decoded = attempt(() => decodeRoute(protocol, route, `${path}.api.${key}`), options)
    if (decoded !== undefined)
      routes[protocol] = decoded
  }

  const limit = record(model.limit, `${path}.limit`)
  const modalities = record(model.modalities, `${path}.modalities`)

  return {
    capabilities: decodeCapabilities(model.capabilities, `${path}.capabilities`),
    cost: optional(model.cost, `${path}.cost`, decodeCost),
    description: options.description === true ? optional(model.description, `${path}.description`, string) : undefined,
    id: string(model.id, `${path}.id`),
    limit: {
      context: optional(limit.context, `${path}.limit.context`, number),
      input: optional(limit.input, `${path}.limit.input`, number),
      output: optional(limit.output, `${path}.limit.output`, number),
    },
    modalities: {
      input: strings(modalities.input, `${path}.modalities.input`),
      output: strings(modalities.output, `${path}.modalities.output`),
    },
    name: string(model.name, `${path}.name`),
    routes,
    status: status as Model['status'],
    type: type as ModelType,
  }
}

/**
 * Gives a protocol a default base URL when every model route for it shares one base URL and has no path.
 */
export const computeDefaults = (models: Record<string, Model>): Provider['defaults'] => {
  const baseURLs = new Map<Protocol, Set<string | undefined>>()
  for (const model of Object.values(models)) {
    for (const route of Object.values(model.routes)) {
      const set = baseURLs.get(route.protocol) ?? new Set()
      set.add(route.path === undefined ? route.baseURL : undefined)
      baseURLs.set(route.protocol, set)
    }
  }

  const defaults: NonNullable<Provider['defaults']> = {}
  for (const [protocol, set] of [...baseURLs].toSorted(([a], [b]) => a.localeCompare(b))) {
    const [baseURL] = set
    if (set.size === 1 && baseURL !== undefined)
      defaults[protocol] = { baseURL }
  }
  return Object.keys(defaults).length === 0 ? undefined : defaults
}

/**
 * Picks the environment variables that hold an API key: all of `env` except template variables,
 * filtered by name when more than one is left.
 */
export const computeApiKeyEnv = (env: string[], models: Record<string, Model>): string[] | undefined => {
  const variables = new Set(Object.values(models).flatMap(model => Object.values(model.routes).flatMap(route => route.variables ?? [])))
  const candidates = env.filter(name => !variables.has(name))
  const keys = candidates.length === 1 ? candidates : candidates.filter(name => /API_?KEY|TOKEN/.test(name) || name.endsWith('_PAT'))
  return keys.length === 0 ? undefined : keys
}

const decodeProvider = (value: unknown, path: string, options: NormalizeOptions): RuntimeProvider => {
  const provider = record(value, path)
  const models: Record<string, RuntimeModel> = {}
  const entries = Object.entries(record(provider.models, `${path}.models`))
    .toSorted(([a], [b]) => a.localeCompare(b))
  for (const [key, model] of entries) {
    const decoded = attempt(() => decodeModel(model, `${path}.models.${key}`, options), options)
    if (decoded !== undefined)
      models[decoded.id] = decoded
  }

  const env = strings(provider.env, `${path}.env`)
  return {
    apiKeyEnv: computeApiKeyEnv(env, models),
    defaults: computeDefaults(models),
    doc: string(provider.doc, `${path}.doc`),
    env,
    id: string(provider.id, `${path}.id`),
    models,
    name: string(provider.name, `${path}.name`),
  }
}

/** Normalizes the models.dev v2 catalog, sorted by provider and model ID. */
export const normalizeCatalog = (catalog: unknown, options: NormalizeOptions = {}): Record<string, RuntimeProvider> => {
  const providers: Record<string, RuntimeProvider> = {}
  const entries = Object.entries(record(catalog, 'catalog'))
    .toSorted(([a], [b]) => a.localeCompare(b))
  for (const [key, provider] of entries) {
    const decoded = attempt(() => decodeProvider(provider, key, options), options)
    if (decoded !== undefined)
      providers[decoded.id] = decoded
  }

  if (Object.keys(providers).length === 0)
    throw new TypeError('catalog: no valid provider')
  return providers
}
