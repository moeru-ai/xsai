import type { Protocol, Provider, ProviderOptions } from './types'

import { chat, decisions, embeddings, generations, messages, responses, speech, systemone, transcriptions, transcriptionsNonStreaming, XSAIError } from 'xsai'

/** `protocol` selects one protocol and `extraBody` goes to the adapter; other fields are defaults for every call. */
export type ModelDefaults<TModel extends (options: never) => unknown, TProtocol extends Protocol>
  = Partial<Omit<CallOptions<TModel>, 'input' | 'signal'>> & { extraBody?: Record<string, unknown>, protocol?: TProtocol }

/** A protocol whose route uses `defaults`, or `[protocol, baseURL, path?]`. Ordered by preference. */
export type ModelRoutes = ([Protocol, string, string] | [Protocol, string] | Protocol)[]

export interface ProviderClient<TModel extends string = string> {
  decision: Method<TModel, typeof decisions, 'decisions' | 'systemone'>
  embedding: Method<TModel, typeof embeddings, 'embeddings'>
  image: Method<TModel, typeof generations, 'generations'>
  speech: Method<TModel, typeof speech, 'speech'>
  text: Method<TModel, typeof chat, 'chat' | 'messages' | 'responses'>
  /** `stream: true` requests SSE, which not every model supports. */
  transcription: Method<TModel, typeof transcriptions, 'transcriptions', { stream?: boolean }>
}

export interface ProviderRoutes<TModel extends string = string> {
  apiKeyEnv?: string[]
  defaults?: Partial<Record<Protocol, { baseURL: string }>>
  id: string
  models: Record<TModel, ModelRoutes>
  protocols?: Protocol[]
}

type Adapter = (options: Pick<ProviderOptions, 'apiKey' | 'fetch' | 'headers'> & { baseURL: string, extraBody?: Record<string, unknown>, model: string, path?: string }) => CallableModel

type CallableModel = (options: never) => unknown

type CallOptions<T> = T extends (options: infer O) => unknown ? O : never

type Method<TModel extends string, TAdapter extends Adapter, TProtocol extends Protocol, TOptions = unknown>
  = (model: (string & {}) | TModel, options?: ModelDefaults<ReturnType<TAdapter>, TProtocol> & TOptions) => ReturnType<TAdapter>

/** Protocol order when neither the model nor the provider sets one. */
const DEFAULT_ORDER: Protocol[] = ['chat', 'responses', 'messages', 'decisions', 'systemone', 'embeddings', 'generations', 'speech', 'transcriptions']

const TEMPLATE = /\$\{(\w+)\}/g

/** Sorts protocols by `preference`, then by the default order. */
export const sortProtocols = (protocols: Protocol[], preference: Protocol[] = []) => {
  const order = [...preference, ...DEFAULT_ORDER]
  return protocols.toSorted((a, b) => order.indexOf(a) - order.indexOf(b))
}

/** Compacts a provider to what clients need: routes per model, ordered by preference. */
export const toRoutes = <TModel extends string>(provider: Provider<TModel>): ProviderRoutes<TModel> => ({
  apiKeyEnv: provider.apiKeyEnv,
  defaults: provider.defaults,
  id: provider.id,
  models: Object.fromEntries(Object.entries<Provider['models'][string]>(provider.models).map(([id, model]) => [id, sortProtocols(Object.keys(model.routes) as Protocol[], provider.protocols).map((protocol): ModelRoutes[number] => {
    const { baseURL, path } = model.routes[protocol]!
    const entry: ModelRoutes[number] = path === undefined ? [protocol, baseURL] : [protocol, baseURL, path]
    return path === undefined && provider.defaults?.[protocol]?.baseURL === baseURL ? protocol : entry
  })])) as Record<TModel, ModelRoutes>,
  protocols: provider.protocols,
})

const processEnv = (): Partial<Record<string, string>> =>
  // Reads `process` from `globalThis` so the module also loads where `process` does not exist.
  // eslint-disable-next-line node/prefer-global/process
  (globalThis as { process?: { env?: Partial<Record<string, string>> } }).process?.env ?? {}

const readEnv = (name: string) => {
  const value = processEnv()[name]
  return value === '' ? undefined : value
}

const mergeProviderOptions = (defaults: unknown, options: unknown) => {
  if (defaults === undefined || options === undefined)
    return (options ?? defaults) as Record<string, unknown> | undefined
  const merged: Record<string, unknown> = { ...defaults as Record<string, unknown> }
  for (const [namespace, value] of Object.entries(options as Record<string, unknown>))
    merged[namespace] = { ...merged[namespace] as object, ...value as object }
  return merged
}

/** Wraps a model so that `defaults` apply to every call. Call options win; `providerOptions` merge per namespace. */
const mergeDefaults = (model: CallableModel, defaults: Record<string, unknown>): CallableModel => {
  if (Object.keys(defaults).length === 0)
    return model
  return (options: never) => model({
    ...defaults,
    ...options as Record<string, unknown>,
    providerOptions: mergeProviderOptions(defaults.providerOptions, (options as Record<string, unknown>).providerOptions),
  } as never)
}

/**
 * Creates a client from provider routes. Unset `apiKey` and template variables are read from
 * `process.env` when each model is created, so a client can be created at import time.
 */
export const createClient = <TModel extends string>(routes: ProviderRoutes<TModel>, options: ProviderOptions = {}): ProviderClient<TModel> => {
  const connect = (adapters: Partial<Record<Protocol, Adapter>>) => (model: string, { extraBody, protocol, ...defaults }: { extraBody?: Record<string, unknown>, protocol?: Protocol } = {}) => {
    const candidates = protocol === undefined ? Object.keys(adapters) as Protocol[] : [protocol]
    const known = Object.hasOwn(routes.models, model) ? routes.models[model as TModel] : undefined
    const available: [Protocol, string, string?][] = known === undefined
      ? sortProtocols(Object.keys(routes.defaults ?? {}) as Protocol[], routes.protocols).map(p => [p, routes.defaults![p]!.baseURL])
      : known.map(entry => typeof entry === 'string' ? [entry, routes.defaults![entry]!.baseURL] : entry)
    const match = available.find(([p]) => candidates.includes(p))
    if (match === undefined)
      throw new XSAIError('invalid-input', `No ${candidates.join(' or ')} route for model ${model} on provider ${routes.id}`)

    const [matched, template, path] = match
    const baseURL = options.baseURL ?? template.replace(TEMPLATE, (_, name: string) => {
      const value = options.variables?.[name] ?? readEnv(name)
      if (value === undefined)
        throw new XSAIError('invalid-input', `Missing variable ${name} for provider ${routes.id}`)
      return value
    })
    const apiKey = options.apiKey ?? routes.apiKeyEnv?.map(readEnv).find(value => value !== undefined)
    const created = adapters[matched]!({ apiKey, baseURL, extraBody, fetch: options.fetch, headers: options.headers, model, path })
    return mergeDefaults(created, defaults)
  }

  return {
    decision: connect({ decisions, systemone }),
    embedding: connect({ embeddings }),
    image: connect({ generations }),
    speech: connect({ speech }),
    text: connect({ chat, messages, responses }),
    transcription: (model: string, { stream, ...options }: { stream?: boolean } = {}) =>
      connect({ transcriptions: stream === true ? transcriptions : transcriptionsNonStreaming })(model, options),
  } as ProviderClient<TModel>
}
