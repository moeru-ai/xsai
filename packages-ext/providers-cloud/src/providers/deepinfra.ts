import { createChatProvider, createEmbedProvider, createModelProvider, merge } from '@xsai-ext/shared-providers'

/**
 * [DeepInfra](https://deepinfra.com/) provider
 *
 * @see {@link https://deepinfra.com/pricing} and {@link https://deepinfra.com/docs/openai_api}
 */
export const createDeepInfra = (apiKey: string, baseURL = 'https://api.deepinfra.com/v1/openai/') => merge(
  createChatProvider<
    | 'deepseek-ai/DeepSeek-R1'
    | 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B'
    | 'deepseek-ai/DeepSeek-R1-Distill-Qwen-32B'
    | 'deepseek-ai/DeepSeek-V3'
    | 'google/gemma-2-27b-it'
    | 'meta-llama/Llama-3.3-70B-Instruct'
    | 'meta-llama/Llama-3.3-70B-Instruct-Turbo'
    | 'microsoft/phi-4'
    | 'mistralai/Mixtral-8x7B-Instruct-v0.1'
    | 'mistralai/Mixtral-8x22B-Instruct-v0.1'
    | 'mistralai/Mixtral-8x22B-v0.1'
    | 'Qwen/QVQ-72B-Preview'
    | 'Qwen/Qwen2.5-7B-Instruct'
    | 'Qwen/Qwen2.5-72B-Instruct'
    | 'Qwen/Qwen2.5-Coder-32B-Instruct'
    | 'Qwen/QwQ-32B-Preview'
  >({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createEmbedProvider<
    | 'bge-base-en-v1.5'
    | 'bge-large-en-v1.5'
    | 'e5-base-v2'
    | 'e5-large-v2'
    | 'gte-base'
    | 'gte-large'
  >({ apiKey, baseURL }),
)
