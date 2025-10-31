import type { Provider } from './types'

export const overrides: Record<string, Partial<Provider>> = {
  deepseek: {
    _overrides: {
      create: 'DeepSeek',
    },
  },
}
