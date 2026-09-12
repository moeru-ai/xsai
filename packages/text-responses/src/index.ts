import type { HttpOptions } from '@xsai/shared'
import type { LanguageModel } from '@xsai/text-primitives'

import { mergedExtra, wireRequest } from '@xsai/text-primitives'

import { normalizeInput, normalizeToolChoice, normalizeTools, responsesEventStream } from './utils'

export const responses = (options: HttpOptions): LanguageModel => async (context, modelOptions) =>
  wireRequest(options, modelOptions, {
    body: {
      input: normalizeInput(context.input),
      instructions: context.instructions,
      max_output_tokens: modelOptions?.maxOutputTokens,
      model: options.model,
      reasoning: modelOptions?.reasoningEffort === undefined
        ? undefined
        : {
            ...mergedExtra(options, modelOptions, 'reasoning'),
            effort: modelOptions.reasoningEffort,
          },
      stream: true,
      temperature: modelOptions?.temperature,
      tool_choice: normalizeToolChoice(modelOptions?.toolChoice, mergedExtra(options, modelOptions, 'tool_choice')),
      tools: normalizeTools(context.tools),
      top_p: modelOptions?.topP,
    },
    path: 'responses',
  }, responsesEventStream())
