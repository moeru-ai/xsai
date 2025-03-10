import {
  createChatProvider,
  createEmbedProvider,
  createMetadataProvider,
  createModelProvider,
  createSpeechProvider,
  createTranscriptionProvider,
  merge,
} from '@xsai-ext/shared-providers'

/** @see {@link https://docs.litellm.ai/docs/#litellm-proxy-server-llm-gateway} */
export const createLiteLLM = (apiKey: string, baseURL = 'http://localhost:4000/v1/') => merge(
  createMetadataProvider('litellm'),
  createChatProvider({ apiKey, baseURL }),
  createEmbedProvider({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createSpeechProvider({ apiKey, baseURL }),
  createTranscriptionProvider({ apiKey, baseURL }),
)
