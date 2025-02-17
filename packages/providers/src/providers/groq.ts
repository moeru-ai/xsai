import type { ChatProvider, ModelProvider, ProviderOptions, ProviderResult, TranscriptionProvider } from '../types'

import { generateCRO } from '../utils/generate-cro'

export const createGroq = (userOptions: ProviderOptions<true>):
  /** @see {@link https://console.groq.com/docs/models} */
  ChatProvider<
    | 'deepseek-r1-distill-llama-70b'
    | 'deepseek-r1-distill-qwen-32b'
    | 'llama-3.3-70b-specdec'
    | 'llama-3.3-70b-versatile'
    | 'qwen-2.5-32b'
    | 'qwen-2.5-coder-32b'
  >
  & ModelProvider
  & TranscriptionProvider<
    | 'whisper-large-v3'
    | 'whisper-large-v3-turbo'
  > => {
  const options: ProviderResult = {
    ...userOptions,
    baseURL: userOptions.baseURL ?? new URL('https://api.groq.com/openai/v1/'),
  }

  const result = (model: string) => generateCRO(model, options)

  return {
    chat: result,
    model: () => options,
    transcription: result,
  }
}
