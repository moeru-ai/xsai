import type { ProviderClient } from './client'
import type { Provider, ProviderOptions } from './types'

import { createClient, toRoutes } from './client'

export type { ModelDefaults, ModelRoutes, ProviderClient, ProviderRoutes } from './client'

/** Creates a client from provider data, such as a `/models/*` module or a `fetchProviders()` result. */
export const createProvider = <TModel extends string>(provider: Provider<TModel>, options?: ProviderOptions): ProviderClient<TModel> =>
  createClient(toRoutes(provider), options)
