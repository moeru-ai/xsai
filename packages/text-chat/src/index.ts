import type { HttpOptions } from '@xsai/shared'
import type { LanguageModel } from '@xsai/text-primitives'

import { mergedExtra, wireRequest } from '@xsai/text-primitives'

import { chatEventStream, normalizeInput, normalizeToolChoice, normalizeTools } from './utils'

export type * from './metadata'

export const chat = (options: HttpOptions): LanguageModel => async (context, modelOptions) =>
  wireRequest(options, modelOptions, {
    body: {
      max_tokens: modelOptions?.maxOutputTokens,
      messages: normalizeInput(context),
      model: options.model,
      reasoning_effort: modelOptions?.reasoningEffort,
      stream: true,
      stream_options: {
        include_usage: true,
        ...mergedExtra(options, modelOptions, 'stream_options'),
      },
      temperature: modelOptions?.temperature,
      tool_choice: normalizeToolChoice(modelOptions?.toolChoice, mergedExtra(options, modelOptions, 'tool_choice')),
      tools: normalizeTools(context.tools),
      top_p: modelOptions?.topP,
    },
    checkDone: true,
    path: 'chat/completions',
  }, chatEventStream())
