import type { SpeechModel, SpeechModelOptions } from './model'

import { streamSpeech } from './stream'

export const generateSpeech = async (model: SpeechModel, options: SpeechModelOptions): Promise<Blob> =>
  streamSpeech(model, options).then(async r => r.blob())
