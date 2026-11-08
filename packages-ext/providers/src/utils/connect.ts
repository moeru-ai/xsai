import type { ModelOptions, Protocol, Provider, RouteTarget } from '../types'

import { route } from '../route'

type Adapter<T> = (options: Omit<RouteTarget, 'protocol'> & Pick<ModelOptions, 'apiKey' | 'fetch' | 'headers'>) => T

/** Resolves a route in `order`, or only `options.protocol`, and creates the model with its adapter. */
export const connect = <TProtocol extends Protocol, T>(
  adapters: Record<TProtocol, Adapter<T>>,
  order: readonly TProtocol[],
  provider: Provider<string>,
  model: string,
  options: ModelOptions<TProtocol>,
): T => {
  const { protocol, ...target } = route(provider, model, options.protocol ?? order, options)
  return adapters[protocol as TProtocol]({ ...target, apiKey: options.apiKey, fetch: options.fetch, headers: options.headers })
}
