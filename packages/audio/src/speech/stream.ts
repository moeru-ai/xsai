import type { SpeechModel, SpeechModelOptions } from './model'

export const streamSpeech = async (model: SpeechModel, options: SpeechModelOptions): Promise<Response> =>
  model(options)
