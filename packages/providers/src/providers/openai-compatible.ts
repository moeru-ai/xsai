import type { ChatProvider, EmbedProvider, ModelProvider, ProviderOptions, ProviderResult } from '../types'

import { generateCRO } from '../utils/generate-cro'

export const createOpenAICompatible = (userOptions: ProviderOptions<true> & Required<Pick<ProviderOptions<true>, 'baseURL'>>):
  ChatProvider
  & EmbedProvider
  & ModelProvider => {
  const options: ProviderResult = {
    ...userOptions,
    baseURL: userOptions.baseURL,
  }

  const result = (model: string) => generateCRO(model, options)

  return {
    chat: result,
    embed: result,
    model: () => options,
  }
}
