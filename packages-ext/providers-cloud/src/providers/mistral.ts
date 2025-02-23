import {
  createChatProvider,
  createEmbedProvider,
  createMetadata,
  createModelProvider,
  defineProvider,
} from '@xsai-ext/shared-providers'

/** @see {@link https://docs.mistral.ai} */
export const createMistral = (apiKey: string, baseURL = 'https://api.mistral.ai/v1/') => defineProvider(
  createMetadata('mistral'),
  createChatProvider<
    | 'codestral-latest'
    | 'codestral-mamba-latest'
    | 'ministral-3b-latest'
    | 'ministral-8b-latest'
    | 'mistral-large-latest'
    | 'mistral-moderation-latest'
    | 'mistral-small-latest'
    | 'mistral-tiny-latest'
  >({ apiKey, baseURL }),
  createEmbedProvider<'mistral-embed'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)
