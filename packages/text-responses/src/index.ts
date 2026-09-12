import type { HttpOptions } from '@xsai/shared'
import type { LanguageModel } from '@xsai/text-primitives'

import { mergedExtra, onlyDefined, wireRequest } from '@xsai/text-primitives'

import { normalizeInput, normalizeToolChoice, normalizeTools, responsesEventStream } from './utils'

export const responses = (options: HttpOptions): LanguageModel => async (context, modelOptions) =>
  wireRequest(options, modelOptions, {
    body: {
      input: normalizeInput(context.input),
      instructions: context.instructions,
      ...onlyDefined({ max_output_tokens: modelOptions?.maxOutputTokens }),
      model: options.model,
      ...(modelOptions?.reasoningEffort === undefined
        ? {}
        : {
            reasoning: {
              ...mergedExtra(options, modelOptions, 'reasoning'),
              effort: modelOptions.reasoningEffort,
            },
          }),
      stream: true,
      ...onlyDefined({ temperature: modelOptions?.temperature }),
      ...(modelOptions?.toolChoice === undefined
        ? {}
        : {
            tool_choice: normalizeToolChoice(modelOptions.toolChoice, mergedExtra(options, modelOptions, 'tool_choice')),
          }),
      ...onlyDefined({ top_p: modelOptions?.topP }),
      tools: normalizeTools(context.tools),
    },
    path: 'responses',
  }, responsesEventStream())
