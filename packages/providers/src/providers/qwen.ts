import type { ChatProvider, EmbedProvider, ModelProvider, ProviderOptions, ProviderResult } from '../types'

import { generateCRO } from '../utils/generate-cro'

/**
 * Qwen provider.
 *
 * @see {@link https://tongyi.aliyun.com/} and {@link https://chat.qwenlm.ai/}
 */
export const createQwen = (userOptions: ProviderOptions<true>):
  /**
   * @see {@link https://help.aliyun.com/zh/model-studio/developer-reference/compatibility-of-openai-with-dashscope}
   * and {@link https://help.aliyun.com/zh/model-studio/developer-reference/use-qwen-by-calling-api}
   */
  ChatProvider<
    | 'deepseek-r1'
    | 'deepseek-v3'
    | 'qwen2.5-7b-instruct'
    | 'qwen2.5-32b-instruct'
    | 'qwen2.5-72b-instruct'
    | 'qwen2.5-coder-7b-instruct'
    | 'qwen2.5-coder-14b-instruct'
    | 'qwen2.5-coder-32b-instruct'
    | 'qwen2.5-math-72b-instruct'
    | 'qwen-math-plus'
    | 'qwen-math-turbo'
    | 'qwen-max'
    | 'qwen-max-longcontext'
    | 'qwen-plus'
    | 'qwen-turbo'
    | 'qwen-vl-max'
    | 'qwen-vl-ocr'
    | 'qwen-vl-plus'
  >
  & EmbedProvider<'text-embedding-v1' | 'text-embedding-v2' | 'text-embedding-v3'>
  & ModelProvider => {
  const options: ProviderResult = {
    ...userOptions,
    baseURL: userOptions.baseURL ?? new URL('https://dashscope.aliyuncs.com/compatible-mode/v1/'),
  }

  const result = (model: string) => generateCRO(model, options)

  return {
    chat: result,
    embed: result,
    model: () => options,
  }
}
