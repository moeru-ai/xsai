import { createChatProvider, createMetadataProvider, createModelProvider, merge } from '@xsai-ext/shared-providers'

/** @see {@link https://platform.moonshot.cn/docs/api/chat} */
export const createMoonshot = (apiKey: string, baseURL = 'https://api.moonshot.cn/v1/') => merge(
  createMetadataProvider('moonshot'),
  /** @see {@link https://platform.moonshot.cn/docs/api/chat#%E5%85%AC%E5%BC%80%E7%9A%84%E6%9C%8D%E5%8A%A1%E5%9C%B0%E5%9D%80} */
  createChatProvider<
    | 'moonshot-v1-8k'
    | 'moonshot-v1-8k-vision-preview'
    | 'moonshot-v1-32k'
    | 'moonshot-v1-32k-vision-preview'
    | 'moonshot-v1-128k'
    | 'moonshot-v1-128k-vision-preview'
    | 'moonshot-v1-auto'
  >({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)
