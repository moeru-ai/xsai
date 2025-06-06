import {
  createChatProvider,
  createEmbedProvider,
  createMetadataProvider,
  createModelProvider,
  merge,
} from '@xsai-ext/shared-providers'

/** @see {@link https://docs.fireworks.ai/getting-started/introduction} */
export const createFireworks = (apiKey: string, baseURL = 'https://api.fireworks.ai/inference/v1/') => merge(
  createMetadataProvider('fireworks'),
  createChatProvider<
    | 'accounts/fireworks/models/deepseek-r1'
    | 'accounts/fireworks/models/deepseek-v3'
    | 'accounts/fireworks/models/llama-v3p3-70b-instruct'
    | 'accounts/fireworks/models/phi-3-vision-128k-instruct'
    | 'accounts/fireworks/models/qwen2p5-72b-instruct'
    | 'accounts/fireworks/models/qwen2p5-coder-32b-instruct'
    | 'accounts/fireworks/models/qwen-qwq-32b'
  >({ apiKey, baseURL }),
  createEmbedProvider<'nomic-ai/nomic-embed-text-v1.5'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)
