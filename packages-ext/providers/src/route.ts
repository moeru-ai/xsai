import type { Protocol, Provider, RouteOptions, RouteTarget } from './types'

/**
 * Resolves the first of `protocols` that the model has a route for.
 * A model that is not in the catalog uses `provider.defaults`.
 */
export const route = <TModel extends string>(
  provider: Provider<TModel>,
  model: (string & {}) | TModel,
  protocols: Protocol | readonly Protocol[],
  options: RouteOptions = {},
): RouteTarget => {
  const known = Object.hasOwn(provider.models, model) ? provider.models[model as TModel] : undefined
  for (const protocol of typeof protocols === 'string' ? [protocols] : protocols) {
    const target: undefined | { baseURL: string, path?: string } = known === undefined ? provider.defaults?.[protocol] : known.routes[protocol]
    if (target === undefined)
      continue

    const baseURL = target.baseURL.replace(/\$\{(\w+)\}/g, (_, name: string) => {
      const value = options.variables?.[name]
      if (value === undefined)
        throw new Error(`Missing variable ${name} for provider ${provider.id}`)
      return value
    })
    return { baseURL, model, path: target.path, protocol }
  }

  throw new Error(`No ${[protocols].flat().join(' or ')} route for model ${model} on provider ${provider.id}`)
}
