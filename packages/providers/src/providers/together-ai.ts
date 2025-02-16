import type { ListModelsResponse, Model } from '@xsai/model'

import type { ChatProvider, EmbedProvider, ModelProvider, ProviderOptions, ProviderResult } from '../types'

import { generateCRO } from '../utils/generate-cro'

export const createTogetherAI = (userOptions: ProviderOptions<true>):
  /** @see {@link https://api.together.ai/models} */
  ChatProvider<
    | 'deepseek-ai/deepseek-llm-67b-chat'
    | 'deepseek-ai/DeepSeek-R1'
    | 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B'
    | 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free'
    | 'deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B'
    | 'deepseek-ai/DeepSeek-R1-Distill-Qwen-14B'
    | 'deepseek-ai/DeepSeek-V3'
    | 'google/gemma-2-9b-it'
    | 'google/gemma-2-27b-it'
    | 'google/gemma-2b-it'
    | 'meta-llama/Llama-3.3-70B-Instruct-Turbo'
    | 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free'
    | 'meta-llama/Llama-Vision-Free'
    | 'microsoft/WizardLM-2-8x22B'
    | 'mistralai/Mixtral-8x22B-Instruct-v0.1'
    | 'NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO'
    | 'nvidia/Llama-3.1-Nemotron-70B-Instruct-HF'
    | 'Qwen/Qwen2-72B-Instruct'
    | 'Qwen/Qwen2-VL-72B-Instruct'
    | 'Qwen/Qwen2.5-7B-Instruct-Turbo'
    | 'Qwen/Qwen2.5-72B-Instruct-Turbo'
    | 'Qwen/Qwen2.5-Coder-32B-Instruct'
    | 'Qwen/QwQ-32B-Preview'
    | 'togethercomputer/m2-bert-80M-2k-retrieval'
    | 'togethercomputer/m2-bert-80M-8k-retrieval'
    | 'togethercomputer/m2-bert-80M-32k-retrieval'
  >
  & EmbedProvider<
    | 'BAAI/bge-base-en-v1.5'
    | 'BAAI/bge-large-en-v1.5'
  >
  & ModelProvider => {
  const options: ProviderResult = {
    ...userOptions,
    baseURL: userOptions.baseURL ?? new URL('https://api.together.xyz/v1/'),
  }

  const result = (model: string) => generateCRO(model, options)

  return {
    chat: result,
    embed: result,
    model: () => {
      return {
        ...options,
        fetch: async (...args) => {
          return fetch(...args)
            .then(async res => res.json() as Promise<Model[]>)
            .then(models => Response.json(
              {
                data: models,
                object: 'list',
              } satisfies ListModelsResponse,
            ))
        },
      }
    },
  }
}
