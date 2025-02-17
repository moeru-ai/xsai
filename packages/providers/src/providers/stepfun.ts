import type { ChatProvider, ModelProvider, ProviderOptions, ProviderResult, SpeechProvider, TranscriptionProvider } from '../types'

import { generateCRO } from '../utils/generate-cro'

/**
 * Stepfun provider
 *
 * @see {@link https://www.stepfun.com/} and {@link https://platform.stepfun.com/docs/overview/concept}
 */
export const createStepfun = (userOptions: ProviderOptions<true>):
  /** @see {@link https://platform.openai.com/docs/models#model-endpoint-compatibility} */
  ChatProvider<
    | 'step-1-8k'
    | 'step-1-32k'
    | 'step-1-128k'
    | 'step-1-256k'
    | 'step-1-flash'
    | 'step-1.5v-mini'
    | 'step-1o-turbo-vision'
    | 'step-1o-vision-32k'
    | 'step-1v-8k'
    | 'step-1v-32k'
    | 'step-1x-medium'
    | 'step-2-16k'
    | 'step-2-16k-202411'
    | 'step-2-16k-exp'
    | 'step-2-mini'
  >
  & ModelProvider
  & SpeechProvider<
    | 'step-tts-mini'
  >
  & TranscriptionProvider<
  | 'step-asr'
  > => {
  const options: ProviderResult = {
    ...userOptions,
    baseURL: userOptions.baseURL ?? new URL('https://api.stepfun.com/v1/'),
  }

  const result = (model: string) => generateCRO(model, options)

  return {
    chat: result,
    model: () => options,
    speech: result,
    transcription: result,
  }
}
