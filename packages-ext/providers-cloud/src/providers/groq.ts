import {
  createChatProvider,
  createMetadata,
  createModelProvider,
  createTranscriptionProvider,
  defineProvider,
} from '@xsai-ext/shared-providers'

export const createGroq = (apiKey: string, baseURL = 'https://api.groq.com/openai/v1/') => defineProvider(
  createMetadata('groq'),
  /** @see {@link https://console.groq.com/docs/models} */
  createChatProvider<
    | 'deepseek-r1-distill-llama-70b'
    | 'deepseek-r1-distill-qwen-32b'
    | 'llama-3.3-70b-versatile'
    | 'qwen-2.5-32b'
  >({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createTranscriptionProvider<'whisper-large-v3' | 'whisper-large-v3-turbo'>({ apiKey, baseURL }),
)
