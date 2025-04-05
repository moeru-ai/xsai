import {
  createChatProvider,
  createMetadataProvider,
  createModelProvider,
  merge,
} from '@xsai-ext/shared-providers'

/** @see {@link https://featherless.ai/models} */
export const createFatherlessAI = (apiKey: string, baseURL = 'https://api.featherless.ai/v1/') => merge(
  createMetadataProvider('fatherless-ai'),
  createChatProvider<
    | 'deepseek-ai/DeepSeek-R1'
    | 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B'
    | 'deepseek-ai/DeepSeek-V3-0324'
    | 'google/gemma-3-27b-it'
    | 'google/gemma-3-27b-pt'
    | 'meta-llama/Llama-3.3-70B-Instruct'
  >({ apiKey, baseURL }),
  createModelProvider({
    apiKey,
    baseURL,
    fetch: async (...args: Parameters<typeof globalThis.fetch>) => globalThis.fetch(...args)
      .then(async res => res.json() as Promise<unknown[]>)
      .then(data => Response.json({ data, object: 'list' })),
  }),
)
