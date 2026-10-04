import type { SpeechModel, SpeechOptions } from './model'

export const streamSpeech = async (model: SpeechModel, options: SpeechOptions): Promise<Response> =>
  model(options)
