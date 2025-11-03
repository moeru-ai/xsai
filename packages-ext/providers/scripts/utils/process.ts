import type { CodeGenProvider, Provider } from './types'

export const SUFFIX = ['_KEY', '_TOKEN'] as const

export const toCodeGenProvider = (provider: Provider): CodeGenProvider => ({
  apiKey: provider.env.filter(e => SUFFIX.some(s => e.endsWith(s))),
  baseURL: provider.api!,
  capabilities: provider._capabilities,
  doc: provider.doc,
  id: provider.id,
  models: Object.values(provider.models).map(({ id }) => id),
  name: provider.name,
  overrides: provider._overrides,
})
