import {
  createChatProvider,
  createEmbedProvider,
  createMetadataProvider,
  createModelProvider,
  merge,
} from '@xsai-ext/shared-providers'

/** @see {@link https://chat.qwenlm.ai/} */
export const createQwen = (apiKey: string, baseURL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/') => merge(
  createMetadataProvider('qwen'),
  /** @see {@link https://help.aliyun.com/zh/model-studio/getting-started/models} */
  createChatProvider<
    | 'qwen2.5-32b-instruct'
    | 'qwen2.5-72b-instruct'
    | 'qwen2.5-coder-32b-instruct'
    | 'qwen2.5-math-72b-instruct'
    | 'qwen2.5-vl-72b-instruct'
    | 'qwen-max'
    | 'qwen-plus'
    | 'qwen-turbo'
    | 'qwq-32b'
  >({ apiKey, baseURL }),
  createEmbedProvider<'text-embedding-v3'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)
