import type { CodeGenProvider, Provider } from './types'

export const processOpenAICompatible = (providers: Provider[]): CodeGenProvider[] =>
  providers
    .filter(({ api }) => api != null)
    .map(provider => ({
      apiKey: provider.env.find(v => v.endsWith('_API_KEY')),
      baseURL: provider.api!,
      doc: provider.doc,
      id: provider.id,
      models: Object.values(provider.models).map(({ id }) => id),
      name: provider.name,
    }))
