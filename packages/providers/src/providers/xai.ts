import type { ChatProvider, ModelProvider, ProviderOptions, ProviderResult } from '../types'

import { generateCRO } from '../utils/generate-cro'

/**
 * xAI provider
 *
 * @see {@link https://docs.x.ai/docs/overview}
 */
export const createXAI = (userOptions: ProviderOptions<true>):
  /** @see {@link https://docs.x.ai/docs/guides/migration} */
  ChatProvider<
    | 'grok-2-1212'
    | 'grok-2-vision-1212'
    | 'grok-beta'
    | 'grok-vision-beta'
  >
  & ModelProvider => {
  const options: ProviderResult = {
    ...userOptions,
    baseURL: userOptions.baseURL ?? new URL('https://api.x.ai/v1/'),
  }

  const result = (model: string) => generateCRO(model, options)

  return {
    chat: result,
    model: () => options,
  }
}
