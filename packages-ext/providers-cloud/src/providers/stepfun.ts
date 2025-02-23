import {
  createChatProvider,
  createMetadata,
  createModelProvider,
  createSpeechProvider,
  createTranscriptionProvider,
  defineProvider,
} from '@xsai-ext/shared-providers'

/** @see {@link https://www.stepfun.com} */
export const createStepfun = (apiKey: string, baseURL = 'https://api.stepfun.com/v1/') => defineProvider(
  createMetadata('stepfun'),
  createChatProvider<
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
  >({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createSpeechProvider<'step-tts-mini'>({ apiKey, baseURL }),
  createTranscriptionProvider<'step-asr'>({ apiKey, baseURL }),
)
