import type { CollectResult, LanguageModel, LoopOptions } from '@xsai/text-primitives'

import { collect, loop } from '@xsai/text-primitives'

export const generateText = async (model: LanguageModel, options: LoopOptions): Promise<CollectResult> =>
  collect(loop(model, options))
