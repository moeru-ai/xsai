import type { Provider } from './types'

export const overrides: Record<string, Partial<Provider>> = {
  'cerebras': {
    _capabilities: {
      embed: true,
    },
    api: 'https://api.cerebras.ai/v1/',
  },
  'deepinfra': {
    _capabilities: {
      embed: true,
    },
    api: 'https://api.deepinfra.com/v1/openai/',
  },
  'deepseek': {
    _overrides: {
      create: 'DeepSeek',
    },
  },
  'fireworks-ai': {
    _overrides: {
      create: 'Fireworks',
      id: 'fireworks',
    },
  },
  'google': {
    _capabilities: {
      embed: true,
    },
    _overrides: {
      create: 'GoogleGenerativeAI',
    },
    api: 'https://generativelanguage.googleapis.com/v1beta/openai/',
  },
  'groq': {
    _capabilities: {
      embed: true,
    },
    api: 'https://api.groq.com/openai/v1/',
  },
  'minimax': {
    api: 'https://api.minimax.io/v1/',
  },
  'mistral': {
    _capabilities: {
      embed: true,
    },
    api: 'https://api.mistral.ai/v1/',
  },
  'openai': {
    _capabilities: {
      embed: true,
      image: true,
      speech: true,
      transcription: true,
    },
    _overrides: {
      create: 'OpenAI',
    },
    api: 'https://api.openai.com/v1/',
  },
  'perplexity': {
    api: 'https://api.perplexity.ai/',
  },
  'siliconflow': {
    _capabilities: {
      embed: true,
      speech: true,
      transcription: true,
    },
    _overrides: {
      create: 'SiliconFlow',
    },
  },
  'xai': {
    api: 'https://api.x.ai/v1/',
  },
}
