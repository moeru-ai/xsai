import type { ProviderOptions, SpeechProvider } from '../../types'

import { generateCRO } from '../../utils/generate-cro'

export interface UnSpeechOptions {
  /** @experimental */
  extraBody?: Record<string, unknown>
  model: `elevenlabs/${string}` | `koemotion/${string}` | `openai/${string}` | ({} & string)
  voice: string
}

export const createUnSpeech = (userOptions?: ProviderOptions<true>): SpeechProvider<UnSpeechOptions> => ({
  speech: (options: UnSpeechOptions) => ({
    ...options,
    ...generateCRO(options.model, {
      ...userOptions,
      baseURL: userOptions?.baseURL ?? new URL('http://localhost:5933/v1/'),
    }),
  }),
})
