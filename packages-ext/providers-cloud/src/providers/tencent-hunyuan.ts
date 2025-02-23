import { createChatProvider, createEmbedProvider, createMetadataProvider, merge } from '@xsai-ext/shared-providers'

/** @see {@link https://cloud.tencent.com/document/product/1729} */
export const createTencentHunyuan = (apiKey: string, baseURL = 'https://api.hunyuan.cloud.tencent.com/v1/') => merge(
  createMetadataProvider('tencent-hunyuan'),
  /** @see {@link https://cloud.tencent.com/document/product/1729/111007} */
  createChatProvider<
    | 'hunyuan-code'
    | 'hunyuan-large'
    | 'hunyuan-role'
    | 'hunyuan-translation'
    | 'hunyuan-turbo'
    | 'hunyuan-turbo-latest'
  >({ apiKey, baseURL }),
  createEmbedProvider<'hunyuan-embedding'>({ apiKey, baseURL }),
)
