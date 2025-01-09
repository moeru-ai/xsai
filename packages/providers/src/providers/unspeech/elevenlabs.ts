import { objCamelToSnake } from '@xsai/shared'

import type { UnSpeechOptions } from '.'
import type { ProviderOptions, SpeechProvider } from '../../types'

import { generateCRO } from '../../utils/generate-cro'

/** @see {@link https://elevenlabs.io/docs/api-reference/text-to-speech/convert#request} */
export interface UnElevenLabsOptions {
  /**
   * This parameter controls text normalization with three modes: ‘auto’, ‘on’, and ‘off’. When set to ‘auto’,
   * the system will automatically decide whether to apply text normalization (e.g., spelling out numbers).
   * With ‘on’, text normalization will always be applied, while with ‘off’, it will be skipped. Cannot be
   * turned on for ‘eleven_turbo_v2_5’ model.
   */
  applyTextNormalization?: 'auto' | 'off' | 'on'
  /**
   * Language code (ISO 639-1) used to enforce a language for the model. Currently only Turbo v2.5
   * supports language enforcement. For other models, an error will be returned if language code is provided.
   */
  languageCode?: string
  /**
   * A list of request_id of the samples that were generated before this generation. Can
   * be used to improve the flow of prosody when splitting up a large task into multiple
   * requests. The results will be best when the same model is used across the generations.
   *
   * In case both next_text and next_request_ids is send, next_text will be ignored.
   * A maximum of 3 request_ids can be send.
   */
  nextRequestIds?: string[]
  /**
   * The text that comes after the text of the current request. Can be used to improve
   * the flow of prosody when concatenating together multiple generations or to influence
   * the prosody in the current generation.
   */
  nextText?: string
  /**
   * A list of request_id of the samples that were generated before this generation. Can be
   * used to improve the flow of prosody when splitting up a large task into multiple requests.
   * The results will be best when the same model is used across the generations. In case both
   * previous_text and previous_request_ids is send, previous_text will be ignored. A maximum
   * of 3 request_ids can be send.
   */
  previousRequestIds?: string[]
  /**
   * The text that came before the text of the current request. Can be used to improve the
   * flow of prosody when concatenating together multiple generations or to influence the
   * prosody in the current generation.
   */
  previousText?: string
  /**
   * A list of pronunciation dictionary locators (id, version_id) to be applied to the text.
   * They will be applied in order. You may have up to 3 locators per request
   */
  pronunciationDictionaryLocators?: {
    pronunciationDictionaryId: string
    versionId: string
  }[]
  /**
   * If specified, our system will make a best effort to sample deterministically, such that
   * repeated requests with the same seed and parameters should return the same result.
   * Determinism is not guaranteed. Must be integer between 0 and 4294967295.
   */
  seed?: number
  /**
   * Voice settings overriding stored setttings for the given voice. They are applied only on the given request.
   */
  voiceSettings?: {
    similarityBoost?: number
    stability?: number
    style?: number
    useSpeakerBoost?: boolean
  }
}

/**
 * [ElevenLabs](https://elevenlabs.io/) provider for [UnSpeech](https://github.com/moeru-ai/unspeech)
 * only.
 *
 * [UnSpeech](https://github.com/moeru-ai/unspeech) is a open-source project that provides a
 * OpenAI-compatible audio & speech related API that can be used with various providers such
 * as ElevenLabs, Azure TTS, Google TTS, etc.
 *
 * @param userOptions - The provider options
 * @returns SpeechProvider
 */
export const createUnElevenLabs = (userOptions?: ProviderOptions<false>): SpeechProvider<
  /** @see {@link https://elevenlabs.io/docs/developer-guides/models} */
  'eleven_english_sts_v2' | 'eleven_flash_v2' | 'eleven_flash_v2_5' | 'eleven_multilingual_sts_v2' | 'eleven_multilingual_v2',
  UnElevenLabsOptions
> => {
  const toUnSpeechOptions = ({ applyTextNormalization, languageCode, nextRequestIds, nextText, previousRequestIds, previousText, pronunciationDictionaryLocators, seed, voiceSettings }: UnElevenLabsOptions): UnSpeechOptions => ({
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
  })

  return {
    speech: (model, options) => ({
      ...(options ? toUnSpeechOptions(options) : {}),
      ...generateCRO(`elevenlabs/${model}`, {
        ...userOptions,
        baseURL: userOptions?.baseURL ?? new URL('http://localhost:5933/v1/'),
      }),
    }),
  }
}
