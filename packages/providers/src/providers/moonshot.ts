import type { ChatProvider, ModelProvider, ProviderOptions, ProviderResult } from '../types'

import { generateCRO } from '../utils/generate-cro'

/**
 * Moonshot AI provider
 *
 * @see {@link https://www.moonshot.cn/} and {@link https://kimi.moonshot.cn/}
 */
export const createMoonshot = (userOptions: ProviderOptions<true>):
  /** @see {@link https://platform.moonshot.cn/docs/api/chat#%E5%85%AC%E5%BC%80%E7%9A%84%E6%9C%8D%E5%8A%A1%E5%9C%B0%E5%9D%80} */
  ChatProvider<
    | 'moonshot-v1-8k'
    | 'moonshot-v1-8k-vision-preview'
    | 'moonshot-v1-32k'
    | 'moonshot-v1-32k-vision-preview'
    | 'moonshot-v1-128k'
    | 'moonshot-v1-128k-vision-preview'
    | 'moonshot-v1-auto'
  >
  & ModelProvider => {
  const options: ProviderResult = {
    ...userOptions,
    baseURL: userOptions.baseURL ?? new URL('https://api.moonshot.cn/v1/'),
  }

  const result = (model: string) => generateCRO(model, options)

  return {
    chat: result,
    model: () => options,
  }
}
