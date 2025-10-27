import type { CodeGenProvider } from './types'

export const extraProviders: CodeGenProvider[] = [
  {
    apiKey: 'MINIMAX_API_KEY',
    baseURL: 'https://api.minimax.io/v1/',
    doc: 'https://platform.minimax.io/docs/api-reference/text-openai-api',
    id: 'minimax',
    models: [],
    name: 'Minimax',
  },
  {
    apiKey: 'MINIMAX_API_KEY',
    baseURL: 'https://api.minimaxi.com/v1/',
    doc: 'https://platform.minimaxi.com/docs/api-reference/text-openai-api',
    id: 'minimaxi',
    models: [],
    name: 'Minimaxi',
  },
  {
    apiKey: 'NOVITA_API_KEY',
    baseURL: 'https://api.novita.ai/v3/openai/',
    doc: 'https://novita.ai/docs/guides/llm-api#api-integration',
    id: 'novita',
    models: [],
    name: 'Novita AI',
  },
]
