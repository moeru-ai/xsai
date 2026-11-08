import type { Provider } from '../types'
import type { DeepPartial } from './merge'

import { computeApiKeyEnv, computeDefaults } from '../normalize'
import { merge } from './merge'

export interface CorrectionOptions {
  extra: Provider[]
  overrides: Record<string, Override>
  /** Throws on an override for an unknown provider or an extra provider that models.dev also lists. */
  strict?: boolean
}

/** `defaults` replaces computed defaults per protocol; other fields deep-merge. */
export type Override = DeepPartial<Omit<Provider, 'defaults'>> & Pick<Provider, 'defaults'>

/**
 * Applies overrides and adds extra providers. Without `strict`, an override for a missing provider is skipped
 * and models.dev wins over an extra provider with the same ID.
 */
export const applyCorrections = <T extends Provider>(providers: Record<string, T>, { extra, overrides, strict = false }: CorrectionOptions): Record<string, Provider | T> => {
  if (strict) {
    for (const id of Object.keys(overrides)) {
      if (!Object.hasOwn(providers, id))
        throw new Error(`Override for unknown provider: ${id}`)
    }
    for (const provider of extra) {
      if (Object.hasOwn(providers, provider.id))
        throw new Error(`Extra provider clashes with models.dev: ${provider.id}`)
    }
  }

  const corrected: Record<string, Provider | T> = Object.fromEntries(Object.entries(providers).map(([id, provider]) => {
    if (!Object.hasOwn(overrides, id))
      return [id, provider]
    const { defaults, ...patch } = overrides[id]
    const merged = merge<T>(provider, patch as DeepPartial<T>)
    return [id, {
      ...merged,
      apiKeyEnv: 'apiKeyEnv' in patch ? merged.apiKeyEnv : computeApiKeyEnv(merged.env, merged.models),
      defaults: defaults === undefined ? computeDefaults(merged.models) : { ...computeDefaults(merged.models), ...defaults },
    }]
  }))
  for (const provider of extra) {
    if (!Object.hasOwn(corrected, provider.id))
      corrected[provider.id] = provider
  }

  return Object.fromEntries(Object.entries(corrected).toSorted(([a], [b]) => a.localeCompare(b)))
}
