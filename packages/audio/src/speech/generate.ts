import type { SpeechModel, SpeechOptions } from './model'

import { streamSpeech } from './stream'

export const generateSpeech = async (model: SpeechModel, options: SpeechOptions): Promise<Blob> =>
  streamSpeech(model, options).then(async r => r.blob())
