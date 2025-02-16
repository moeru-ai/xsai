import type { ChatProvider, ModelProvider, ProviderOptions, ProviderResult } from '../types'

import { generateCRO } from '../utils/generate-cro'

export const createNovita = (userOptions: ProviderOptions<true>):
  /** @see {@link https://novita.ai/pricing} */
  ChatProvider< | 'cognitivecomputations/dolphin-mixtral-8x22b'
  | 'deepseek/deepseek-r1'
  | 'deepseek/deepseek-r1-distill-llama-8b'
  | 'deepseek/deepseek-r1-distill-llama-70b'
  | 'deepseek/deepseek-r1-distill-qwen-14b'
  | 'deepseek/deepseek-r1-distill-qwen-32b'
  | 'deepseek/deepseek_v3'
  | 'meta-llama/llama-3.2-1b-instruct'
  | 'meta-llama/llama-3.2-3b-instruct'
  | 'meta-llama/llama-3.2-11b-vision-instruct'
  | 'meta-llama/llama-3.3-70b-instruct'
  | 'microsoft/wizardlm-2-8x22b'
  | 'mistralai/mistral-7b-instruct'
  | 'mistralai/mistral-nemo'
  >
  & ModelProvider => {
  const options: ProviderResult = {
    ...userOptions,
    baseURL: userOptions.baseURL ?? new URL('https://api.novita.ai/v3/openai/'),
  }

  const result = (model: string) => generateCRO(model, options)

  return {
    chat: result,
    model: () => options,
  }
}
