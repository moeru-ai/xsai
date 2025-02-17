import type { ChatProvider, ProviderOptions, ProviderResult } from '../types'

import { generateCRO } from '../utils/generate-cro'

/**
 * Perplexity.ai provider
 *
 * @see {@link https://docs.perplexity.ai/guides/getting-started}
 */
export const createPerplexity = (userOptions: ProviderOptions<true>):
/** @see {@link https://docs.perplexity.ai/api-reference/chat-completions} */
ChatProvider<'sonar' | 'sonar-pro' | 'sonar-reasoning' | 'sonar-reasoning-pro'> => {
  const options: ProviderResult = {
    ...userOptions,
    baseURL: userOptions.baseURL ?? new URL('https://api.perplexity.ai/'),
  }

  const result = (model: string) => generateCRO(model, options)

  return {
    chat: result,
  }
}
