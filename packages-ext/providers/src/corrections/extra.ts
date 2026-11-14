import type { Provider } from '../types'

/** Providers that models.dev does not list. */
export const extra: Provider[] = [
  {
    defaults: {
      chat: { baseURL: 'http://localhost:4000/v1/' },
      embeddings: { baseURL: 'http://localhost:4000/v1/' },
    },
    doc: 'https://docs.litellm.ai/docs/proxy/user_keys',
    env: [],
    id: 'litellm',
    models: {},
    name: 'LiteLLM',
  },
  {
    defaults: {
      chat: { baseURL: 'http://localhost:11434/v1/' },
      embeddings: { baseURL: 'http://localhost:11434/v1/' },
    },
    doc: 'https://docs.ollama.com/api/openai-compatibility',
    env: [],
    id: 'ollama',
    models: {},
    name: 'Ollama',
  },
]
