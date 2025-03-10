import {
  createChatProvider,
  createEmbedProvider,
  createMetadataProvider,
  createModelProvider,
  merge,
} from '@xsai-ext/shared-providers'

/** @see {@link https://lmstudio.ai/docs/app/api/endpoints/openai} */
export const createLMStudio = (baseURL = 'http://localhost:1234/v1/') => merge(
  createMetadataProvider('lmstudio'),
  /** @see {@link https://lmstudio.ai/models} */
  createChatProvider({ baseURL }),
  createEmbedProvider({ baseURL }),
  createModelProvider({ baseURL }),
)
