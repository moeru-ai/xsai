import { createMetadataProvider, createSpeechProviderWithExtraOptions, merge } from '@xsai-ext/shared-providers'

export * from './elevenlabs'
export * from './microsoft'

export interface UnSpeechOptions {
  /** @experimental */
  extraBody?: Record<string, unknown>
}

/** @see {@link https://github.com/moeru-ai/unspeech} */
export const createUnSpeech = (apiKey: string, baseURL = 'http://localhost:5933/v1/') => merge(
  createMetadataProvider('unspeech'),
  createSpeechProviderWithExtraOptions<
    | `elevenlabs/${string}`
    | `koemotion/${string}`
    | `openai/${string}`,
    UnSpeechOptions
  >({ apiKey, baseURL }),
)
