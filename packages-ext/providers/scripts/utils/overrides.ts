import type { Provider } from './types'

export const overrides: Record<string, Partial<Provider>> = {
  deepseek: {
    _overrides: {
      create: 'DeepSeek',
    },
  },
  google: {
    _overrides: {
      create: 'GoogleGenerativeAI',
    },
    api: 'https://generativelanguage.googleapis.com/v1beta/openai/',
  },
}
