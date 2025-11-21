import type { CodeGenProvider } from './types'

// TODO: cohere 'https://api.cohere.ai/compatibility/v1/'
export const extraProviders: CodeGenProvider[] = [
  // {
  //   apiKey: ['MINIMAX_API_KEY'],
  //   baseURL: 'https://api.minimax.io/v1/',
  //   doc: 'https://platform.minimax.io/docs/api-reference/text-openai-api',
  //   id: 'minimax',
  //   models: [],
  //   name: 'Minimax',
  // },
  {
    apiKey: ['MINIMAX_API_KEY'],
    baseURL: 'https://api.minimaxi.com/v1/',
    doc: 'https://platform.minimaxi.com/docs/api-reference/text-openai-api',
    id: 'minimaxi',
    models: [],
    name: 'Minimaxi',
  },
  {
    apiKey: ['NOVITA_API_KEY'],
    baseURL: 'https://api.novita.ai/v3/openai/',
    doc: 'https://novita.ai/docs/guides/llm-api#api-integration',
    id: 'novita',
    models: [],
    name: 'Novita AI',
  },
  {
    apiKey: ['SILICON_FLOW_API_KEY'],
    baseURL: 'https://api.siliconflow.cn/v1/',
    capabilities: {
      embed: true,
      speech: true,
      transcription: true,
    },
    doc: 'https://docs.siliconflow.com/en/userguide/quickstart#4-3-call-via-openai-interface',
    id: 'silicon-flow',
    models: [],
    name: 'SiliconFlow',
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
