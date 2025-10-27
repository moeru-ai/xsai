import type { CodeGenProvider, Provider } from './types'

export const toCodeGenProvider = (provider: Provider): CodeGenProvider => ({
  apiKey: provider.env.find(v => v.endsWith('_API_KEY')),
  baseURL: provider.api!,
  doc: provider.doc,
  id: provider.id,
  models: Object.values(provider.models).map(({ id }) => id),
  name: provider.name,
})

export const processOpenAICompatible = (providers: Provider[]): CodeGenProvider[] =>
  providers
    .filter(({ api }) => api != null)
    .map(toCodeGenProvider)

export const toCodeGenProviderForce = (providers: Provider[], id: string, baseURL: string, doc?: string, embed?: boolean): CodeGenProvider =>
  providers
    .filter(p => p.id === id)
    .map(provider => ({
      apiKey: provider.env.find(v => v.endsWith('_API_KEY')),
      baseURL,
      doc: doc ?? provider.doc,
      embed,
      id: provider.id,
      models: Object.values(provider.models).map(({ id }) => id),
      name: provider.name,
    }))[0]
