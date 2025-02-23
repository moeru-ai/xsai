import {
  createChatProvider,
  createEmbedProvider,
  createMetadataProvider,
  createModelProvider,
  defineProvider,
} from '@xsai-ext/shared-providers'

/** @see {@link https://api.together.ai/models} */
export const createTogetherAI = (apiKey: string, baseURL = 'https://api.together.xyz/v1/') => defineProvider(
  createMetadataProvider('together-ai'),
  createChatProvider<
    | 'deepseek-ai/DeepSeek-R1'
    | 'deepseek-ai/DeepSeek-V3'
    | 'google/gemma-2-9b-it'
    | 'google/gemma-2-27b-it'
    | 'meta-llama/Llama-3.3-70B-Instruct-Turbo'
    | 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free'
    | 'meta-llama/Llama-Vision-Free'
    | 'Qwen/Qwen2.5-72B-Instruct-Turbo'
    | 'Qwen/Qwen2.5-Coder-32B-Instruct'
    | 'Qwen/QwQ-32B-Preview'
  >({ apiKey, baseURL }),
  createEmbedProvider<'BAAI/bge-base-en-v1.5' | 'BAAI/bge-large-en-v1.5'>({ apiKey, baseURL }),
  createModelProvider({
    apiKey,
    baseURL,
    fetch: async (...args: Parameters<typeof globalThis.fetch>) => globalThis.fetch(...args)
      .then(async res => res.json() as Promise<unknown[]>)
      .then(data => Response.json({ data, object: 'list' })),
  }),
)
