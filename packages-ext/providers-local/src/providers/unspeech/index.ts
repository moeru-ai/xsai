import { createMetadataProvider, createSpeechProviderWithExtraOptions, defineProvider } from '@xsai-ext/shared-providers'

export interface UnSpeechOptions {
  /** @experimental */
  extraBody?: Record<string, unknown>
}

/** @see {@link https://github.com/moeru-ai/unspeech} */
export const createUnSpeech = (apiKey: string, baseURL = 'http://localhost:5933/v1/') => defineProvider(
  createMetadataProvider('unspeech'),
  createSpeechProviderWithExtraOptions<
    | `elevenlabs/${string}`
    | `koemotion/${string}`
    | `openai/${string}`,
    UnSpeechOptions
  >({ apiKey, baseURL }),
)
