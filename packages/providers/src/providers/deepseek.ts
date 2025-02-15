import type { ChatProvider, ModelProvider, ProviderOptions, ProviderResult } from '../types'

import { generateCRO } from '../utils/generate-cro'

export const createDeepSeek = (userOptions: ProviderOptions<true>):
  /** @see {@link https://api-docs.deepseek.com/quick_start/pricing} */
  ChatProvider<'deepseek-chat' | 'deepseek-reasoner'>
  & ModelProvider => {
  const options: ProviderResult = {
    ...userOptions,
    baseURL: userOptions.baseURL ?? new URL('https://api.deepseek.com/'),
  }

  const result = (model: string) => generateCRO(model, options)

  return {
    chat: result,
    model: () => options,
  }
}
