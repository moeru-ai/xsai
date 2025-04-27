import {
  createChatProvider,
  createEmbedProvider,
  createImageProvider,
  createMetadataProvider,
  createModelProvider,
  createSpeechProvider,
  createTranscriptionProvider,
  merge,
} from '@xsai-ext/shared-providers'

export const createOpenAI = (apiKey: string, baseURL = 'https://api.openai.com/v1/') => merge(
  createMetadataProvider('openai'),
  createChatProvider<'gpt-4o' | 'gpt-4o-mini' | 'o1-mini' | 'o1-preview'>({ apiKey, baseURL }),
  createEmbedProvider<'text-embedding-3-large' | 'text-embedding-3-small'>({ apiKey, baseURL }),
  createImageProvider<'dall-e-2' | 'dall-e-3' | 'gpt-image-1'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createSpeechProvider<'tts-1' | 'tts-1-hd'>({ apiKey, baseURL }),
  createTranscriptionProvider<'whisper-1'>({ apiKey, baseURL }),
)
