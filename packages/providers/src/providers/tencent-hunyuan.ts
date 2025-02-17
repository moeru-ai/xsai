import type { ChatProvider, EmbedProvider, ProviderOptions, ProviderResult } from '../types'

import { generateCRO } from '../utils/generate-cro'

/**
 * Tencent Hunyuan provider
 *
 * @see {@link https://cloud.tencent.com/document/product/1729} and {@link https://cloud.tencent.com/document/product/1729/105701}
 */
export const createTencentHunyuan = (userOptions: ProviderOptions<true>):
  /** @see {@link https://cloud.tencent.com/document/product/1729/111007} */
  ChatProvider<
    | 'hunyuan-code'
    | 'hunyuan-functioncall'
    | 'hunyuan-large'
    | 'hunyuan-large-longcontext'
    | 'hunyuan-lite'
    | 'hunyuan-lite-vision'
    | 'hunyuan-role'
    | 'hunyuan-standard'
    | 'hunyuan-standard-256K'
    | 'hunyuan-standard-vision'
    | 'hunyuan-turbo'
    | 'hunyuan-turbo-vision'
    | 'hunyuan-vision'
  >
  & EmbedProvider<'hunyuan-embedding'> => {
  const options: ProviderResult = {
    ...userOptions,
    baseURL: userOptions.baseURL ?? new URL('https://api.hunyuan.cloud.tencent.com/v1/'),
  }

  const result = (model: string) => generateCRO(model, options)

  return {
    chat: result,
    embed: result,
  }
}
