import type { CollectResult } from './collect'
import type { LoopOptions } from './loop'
import type { LanguageModel } from './types'

import { collect } from './collect'
import { loop } from './loop'

export const generateText = async (model: LanguageModel, options: LoopOptions): Promise<CollectResult> =>
  collect(loop(model, options))
