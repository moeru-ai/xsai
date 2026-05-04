import type { CodeGenProvider } from './types'

export const extraProviders: CodeGenProvider[] = [
  {
    apiKey: ['QIANFAN_API_KEY'],
    baseURL: 'https://qianfan.baidubce.com/v2',
    capabilities: {},
    doc: 'https://cloud.baidu.com/doc/qianfan/s/Hmh4suq26',
    id: 'qianfan',
    models: [],
    name: 'Baidu Qianfan',
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
