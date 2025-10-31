import type { Provider } from './types'

export const overrides: Record<string, Partial<Provider>> = {
  cerebras: {
    _capabilities: {
      embed: true,
    },
    api: 'https://api.cerebras.ai/v1/',
  },
  deepinfra: {
    _capabilities: {
      embed: true,
    },
    api: 'https://api.deepinfra.com/v1/openai/',
  },
  deepseek: {
    _overrides: {
      create: 'DeepSeek',
    },
  },
  google: {
    _capabilities: {
      embed: true,
    },
    _overrides: {
      create: 'GoogleGenerativeAI',
    },
    api: 'https://generativelanguage.googleapis.com/v1beta/openai/',
  },
  groq: {
    _capabilities: {
      embed: true,
    },
    api: 'https://api.groq.com/openai/v1/',
  },
  mistral: {
    _capabilities: {
      embed: true,
    },
    api: 'https://api.mistral.ai/v1/',
  },
  perplexity: {
    api: 'https://api.perplexity.ai/',
  },
  xai: {
    api: 'https://api.x.ai/v1/',
  },
}
