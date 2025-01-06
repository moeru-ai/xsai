import type { ChatProvider, EmbedProvider, ModelProvider, ProviderOptions, ProviderResult } from '../types'

import { generateCRO } from '../utils/generate-cro'

export const createLocalAI = (userOptions?: ProviderOptions<false>):
  /** @see {@link https://localai.io/model-compatibility/} */
  ChatProvider<({} & string)>
  & EmbedProvider<({} & string)>
  & ModelProvider => {
  const options: ProviderResult = {
    ...userOptions,
    baseURL: userOptions?.baseURL ?? new URL('http://localhost:8080/v1/'),
  }

  const result = (model: string) => generateCRO(model, options)

  return {
    chat: result,
    embed: result,
    model: () => options,
  }
}

export const localAI = createLocalAI()
