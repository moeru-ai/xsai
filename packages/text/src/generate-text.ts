import type { CollectResult } from './collect'
import type { StreamTextOptions } from './stream-text'
import type { LanguageModel } from './types'

import { collect } from './collect'
import { streamText } from './stream-text'

export const generateText = async (model: LanguageModel, options: StreamTextOptions): Promise<CollectResult> =>
  collect(streamText(model, options))
