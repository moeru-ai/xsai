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
