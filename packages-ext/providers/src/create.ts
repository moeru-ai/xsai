import type { Protocol, Provider, ProviderOptions, RouteTarget } from './types'

import { speech, transcriptions } from '@xsai/audio'
import { decisions, systemone } from '@xsai/decide'
import { embeddings } from '@xsai/embed'
import { generations } from '@xsai/image'
import { chat } from '@xsai/text-chat'
import { messages } from '@xsai/text-messages'
import { responses } from '@xsai/text-responses'

import { route } from './route'

export interface ProviderClient<TModel extends string = string> {
  decision: (model: (string & {}) | TModel, options?: { protocol?: 'decisions' | 'systemone' }) => ReturnType<typeof decisions>
  embedding: (model: (string & {}) | TModel) => ReturnType<typeof embeddings>
  image: (model: (string & {}) | TModel) => ReturnType<typeof generations>
  speech: (model: (string & {}) | TModel) => ReturnType<typeof speech>
  text: (model: (string & {}) | TModel, options?: { protocol?: 'chat' | 'messages' | 'responses' }) => ReturnType<typeof chat>
  transcription: (model: (string & {}) | TModel) => ReturnType<typeof transcriptions>
}

type Adapter<T> = (options: Omit<RouteTarget, 'protocol'> & Pick<ProviderOptions, 'apiKey' | 'fetch' | 'headers'>) => T

// Reads `process` from `globalThis` so the module also loads where `process` does not exist.
const processEnv = (): Partial<Record<string, string>> =>
  // eslint-disable-next-line node/prefer-global/process
  (globalThis as { process?: { env?: Partial<Record<string, string>> } }).process?.env ?? {}

/** Reads unset options from `process.env` when it exists. Explicit options win. */
const withEnv = (provider: Provider, options: ProviderOptions): ProviderOptions => {
  const env = processEnv()
  const read = (name: string) => env[name] === '' ? undefined : env[name]
  const names = new Set([
    ...Object.values(provider.models).flatMap(model => Object.values(model.routes).flatMap(target => target.variables ?? [])),
    ...Object.values(provider.defaults ?? {}).flatMap(target => Array.from(target.baseURL.matchAll(/\$\{(\w+)\}/g), match => match[1])),
  ])

  return {
    ...options,
    apiKey: options.apiKey ?? provider.apiKeyEnv?.map(read).find(value => value !== undefined),
    variables: {
      ...Object.fromEntries([...names].flatMap(name => read(name) === undefined ? [] : [[name, read(name)!]])),
      ...options.variables,
    },
  }
}

/**
 * Binds a provider to credentials and creates xsAI models from its model IDs.
 * Each model picks the first protocol in order that it has a route for; text prefers Responses, then Messages, then Chat Completions.
 */
export const createProvider = <TModel extends string>(provider: Provider<TModel>, options: ProviderOptions = {}): ProviderClient<TModel> => {
  const resolved = withEnv(provider, options)
  const connect = <TProtocol extends Protocol, T>(adapters: Record<TProtocol, Adapter<T>>, protocols: readonly TProtocol[]) =>
    (model: string, { protocol }: { protocol?: TProtocol } = {}): T => {
      const { protocol: matched, ...target } = route(provider, model, protocol ?? protocols, resolved)
      return adapters[matched as TProtocol]({ ...target, apiKey: resolved.apiKey, fetch: resolved.fetch, headers: resolved.headers })
    }

  return {
    decision: connect({ decisions, systemone }, ['decisions', 'systemone']),
    embedding: connect({ embeddings }, ['embeddings']),
    image: connect({ generations }, ['generations']),
    speech: connect({ speech }, ['speech']),
    text: connect({ chat, messages, responses }, ['responses', 'messages', 'chat']),
    transcription: connect({ transcriptions }, ['transcriptions']),
  }
}
