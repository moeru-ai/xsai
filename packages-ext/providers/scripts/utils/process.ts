import type { CodeGenProvider, Provider } from './types'

export const toCodeGenProvider = (provider: Provider): CodeGenProvider => ({
  apiKey: provider.env.find(v => v.endsWith('_API_KEY')),
  baseURL: provider.api!,
  capabilities: provider._capabilities,
  doc: provider.doc,
  id: provider.id,
  models: Object.values(provider.models).map(({ id }) => id),
  name: provider.name,
  overrides: provider._overrides,
})

export const toCodeGenProviderForce = (providers: Provider[], id: string, baseURL: string, doc?: string, embed?: boolean): CodeGenProvider => {
  const provider = providers.find(p => p.id === id)

  if (!provider)
    throw new Error(`@xsai-ext/providers/sync: provider ${id} not found`)

  return {
    apiKey: provider.env.find(v => v.endsWith('_API_KEY')),
    baseURL,
    capabilities: {
      embed,
    },
    doc: doc ?? provider.doc,
    id: provider.id,
    models: Object.values(provider.models).map(({ id }) => id),
    name: provider.name,
  }
}
