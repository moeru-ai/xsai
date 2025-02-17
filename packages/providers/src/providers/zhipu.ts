import type { ChatProvider, EmbedProvider, ModelProvider, ProviderOptions, ProviderResult } from '../types'

import { generateCRO } from '../utils/generate-cro'

/**
 * Zhipu provider
 */
export const createZhipu = (userOptions: ProviderOptions<true>):
  /** @see {@link https://open.bigmodel.cn/dev/api/thirdparty-frame/openai-sdk} */
  ChatProvider<
    | 'codegeex-4'
    | 'glm-4'
    | 'glm-4-air'
    | 'glm-4-airx'
    | 'glm-4-flash'
    | 'glm-4-long'
    | 'glm-4-plus'
    | 'glm-4v'
    | 'glm-4v-plus'
    | 'glm-zero-preview'
  >
  & EmbedProvider<
    | 'embedding-2'
    | 'embedding-3'
  >
  & ModelProvider => {
  const options: ProviderResult = {
    ...userOptions,
    baseURL: userOptions.baseURL ?? new URL('https://open.bigmodel.cn/api/paas/v4/'),
  }

  const result = (model: string) => generateCRO(model, options)

  return {
    chat: result,
    embed: result,
    model: () => options,
  }
}
