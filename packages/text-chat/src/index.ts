import type { HttpOptions } from '@xsai/shared'
import type { LanguageModel } from '@xsai/text-primitives'

import { mergedExtra, onlyDefined, wireRequest } from '@xsai/text-primitives'

import { chatEventStream, normalizeInput, normalizeToolChoice, normalizeTools } from './utils'

export type * from './metadata'

export const chat = (options: HttpOptions): LanguageModel => async (context, modelOptions) =>
  wireRequest(options, modelOptions, {
    body: {
      ...onlyDefined({ max_tokens: modelOptions?.maxOutputTokens }),
      messages: normalizeInput(context),
      model: options.model,
      ...onlyDefined({ reasoning_effort: modelOptions?.reasoningEffort }),
      stream: true,
      stream_options: {
        include_usage: true,
        ...mergedExtra(options, modelOptions, 'stream_options'),
      },
      ...onlyDefined({ temperature: modelOptions?.temperature }),
      ...(modelOptions?.toolChoice === undefined
        ? {}
        : {
            tool_choice: normalizeToolChoice(modelOptions.toolChoice, mergedExtra(options, modelOptions, 'tool_choice')),
          }),
      ...onlyDefined({ top_p: modelOptions?.topP }),
      tools: normalizeTools(context.tools),
    },
    checkDone: true,
    path: 'chat/completions',
  }, chatEventStream())
