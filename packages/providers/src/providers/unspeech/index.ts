import type { ProviderOptions, SpeechProvider } from '../../types'

import { generateCRO } from '../../utils/generate-cro'

export { createUnElevenLabs, type UnElevenLabsOptions } from './elevenlabs'

export interface UnSpeechOptions {
  /** @experimental */
  extraBody?: Record<string, unknown>
}

export const createUnSpeech = (userOptions?: ProviderOptions<true>): SpeechProvider<
`elevenlabs/${string}` | `koemotion/${string}` | `openai/${string}`,
  UnSpeechOptions
> => ({
  speech: (model, options) => ({
    ...options,
    ...generateCRO(model, {
      ...userOptions,
      baseURL: userOptions?.baseURL ?? new URL('http://localhost:5933/v1/'),
    }),
  }),
})
