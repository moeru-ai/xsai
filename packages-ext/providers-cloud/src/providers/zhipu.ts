import {
  createChatProvider,
  createEmbedProvider,
  createMetadataProvider,
  createModelProvider,
  merge,
} from '@xsai-ext/shared-providers'

/** @see {@link https://open.bigmodel.cn/dev/welcome} */
export const createZhipu = (apiKey: string, baseURL = 'https://open.bigmodel.cn/api/paas/v4/') => merge(
  createMetadataProvider('zhipu'),
  /** @see {@link https://open.bigmodel.cn/dev/api/thirdparty-frame/openai-sdk} */
  createChatProvider<
    | 'glm-4'
    | 'glm-4v'
    | 'glm-4v-plus'
    | 'glm-zero-preview'
  >({ apiKey, baseURL }),
  createEmbedProvider<'embedding-3'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)
