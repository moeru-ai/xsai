import type { ChatProvider, ProviderOptions, ProviderResult } from '../types'

import { generateCRO } from '../utils/generate-cro'

/**
 * Minimax provider
 *
 * @see {@link https://platform.minimaxi.com/document/platform%20introduction?key=66701c8e1d57f38758d58198} and
 * {@link https://intl.minimaxi.com/document/platform%20introduction?key=66701c8e1d57f38758d58198}
 */
export const createMinimax = (userOptions: ProviderOptions<true>):
/** @see {@link https://platform.minimaxi.com/document/ChatCompletion%20v2?key=66701d281d57f38758d581d0#1XspWaYA7baUnFix0otJIQkt} */
ChatProvider<'abab6.5s-chat' | 'DeepSeek-R1' | 'MiniMax-Text-01'> => {
  const options: ProviderResult = {
    ...userOptions,
    baseURL: userOptions.baseURL ?? new URL('https://api.minimaxi.chat/v1/'),
  }

  const result = (model: string) => generateCRO(model, options)

  return {
    chat: result,
  }
}
