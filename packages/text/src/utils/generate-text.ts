import type { CollectResult, LanguageModel, LoopOptions } from '@xsai/text-primitives'

import { collect, loop } from '@xsai/text-primitives'

export type GenerateTextOptions = LoopOptions
export type GenerateTextResult = CollectResult

export const generateText = async (model: LanguageModel, options: GenerateTextOptions): Promise<GenerateTextResult> =>
  collect(loop(model, options))
