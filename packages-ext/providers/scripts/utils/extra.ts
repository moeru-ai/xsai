import type { CodeGenProvider } from './types'

export const extraProviders: CodeGenProvider[] = [
  {
    apiKey: ['STEPFUN_API_KEY'],
    baseURL: 'https://api.stepfun.com/v1/',
    capabilities: {
      embed: true,
      speech: true,
      transcription: true,
    },
    doc: 'https://www.stepfun.com',
    id: 'stepfun',
    models: [],
    name: 'StepFun',
  },
  {
    apiKey: ['TENCENT_HUNYUAN_API_KEY'],
    baseURL: 'https://api.hunyuan.cloud.tencent.com/v1/',
    capabilities: {
      embed: true,
    },
    doc: 'https://cloud.tencent.com/document/product/1729',
    id: 'tencent-hunyuan',
    models: [],
    name: 'Tencent Hunyuan',
  },
  // LOCAL PROVIDERS
  {
    apiKey: ['OLLAMA_API_KEY'],
    baseURL: 'http://localhost:11434/v1/',
    capabilities: {
      embed: true,
    },
    doc: 'https://docs.ollama.com',
    id: 'ollama',
    models: [],
    name: 'Ollama',
  },
  {
    apiKey: ['LITELLM_API_KEY'],
    baseURL: 'http://localhost:4000/v1/',
    capabilities: {
      embed: true,
      speech: true,
      transcription: true,
    },
    doc: 'https://docs.litellm.ai',
    id: 'litellm',
    models: [],
    name: 'LiteLLM',
  },
]
