import { createChatProvider, createEmbedProvider, createModelProvider, createSpeechProvider, createTranscriptionProvider } from '../utils/create'
import { merge } from '../utils/merge'

const baseURL = 'https://openai.com/v1'

export const createOpenAI = (apiKey: string) => merge(
  createChatProvider<'gpt-4o' | 'gpt-4o-mini' | 'o1-mini' | 'o1-preview'>({ apiKey, baseURL }),
  createEmbedProvider<'text-embedding-3-large' | 'text-embedding-3-small'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createSpeechProvider<'tts-1' | 'tts-1-hd'>({ apiKey, baseURL }),
  createTranscriptionProvider<'whisper-1'>({ apiKey, baseURL }),
)
