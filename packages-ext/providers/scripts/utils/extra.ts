import type { CodeGenProvider } from './types'

// TODO: cohere 'https://api.cohere.ai/compatibility/v1/'
export const extraProviders: CodeGenProvider[] = [
  {
    apiKey: ['NOVITA_API_KEY'],
    baseURL: 'https://api.novita.ai/v3/openai/',
    doc: 'https://novita.ai/docs/guides/llm-api#api-integration',
    id: 'novita',
    models: [],
    name: 'Novita AI',
  },
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
]
