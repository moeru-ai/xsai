import { objCamelToSnake } from '@xsai/shared'

import type { UnSpeechOptions } from '.'
import type { ProviderOptions, SpeechProvider } from '../../types'

import { generateCRO } from '../../utils/generate-cro'

/** @see {@link https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request} */
export interface UnElevenLabsOptions {
  applyTextNormalization?: 'auto' | 'off' | 'on'
  languageCode?: string
  model: 'eleven_monolingual_v2' | 'eleven_turbo_v2_5' | ({} & string)
  nextRequestIds?: string[]
  nextText?: string
  previousRequestIds?: string[]
  previousText?: string
  pronunciationDictionaryLocators?: {
    pronunciationDictionaryId: string
    versionId: string
  }[]
  seed?: number
  voice: string
  voiceSettings?: {
    similarityBoost?: number
    stability?: number
    style?: number
    useSpeakerBoost?: boolean
  }
}

export const createUnElevenLabs = (userOptions?: ProviderOptions<false>): SpeechProvider<UnElevenLabsOptions> => {
  const toUnSpeechOptions = ({ applyTextNormalization, languageCode, model, nextRequestIds, nextText, previousRequestIds, previousText, pronunciationDictionaryLocators, seed, voice, voiceSettings }: UnElevenLabsOptions): UnSpeechOptions => ({
    extraBody: objCamelToSnake({
      applyTextNormalization,
      languageCode,
      nextRequestIds,
      nextText,
      previousRequestIds,
      previousText,
      pronunciationDictionaryLocators: pronunciationDictionaryLocators
        ? pronunciationDictionaryLocators.map(pdl => objCamelToSnake(pdl))
        : undefined,
      seed,
      voiceSettings: voiceSettings
        ? objCamelToSnake(voiceSettings)
        : undefined,
    }),
    model: `elevenlabs/${model}`,
    voice,
  })

  return {
    speech: (options: UnElevenLabsOptions) => ({
      ...toUnSpeechOptions(options),
      ...generateCRO(options.model, {
        ...userOptions,
        baseURL: userOptions?.baseURL ?? new URL('http://localhost:5933/v1/'),
      }),
    }),
  }
}
