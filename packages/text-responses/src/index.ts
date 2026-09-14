import type { HttpOptions } from '@xsai/shared'
import type { LanguageModel } from '@xsai/text-primitives'

import { wireRequest } from '@xsai/text-primitives'

import { normalizeInput, normalizeToolChoice, normalizeTools, ResponsesEventStream } from './utils'

export const responses = (options: HttpOptions): LanguageModel => async (context, modelOptions) =>
  wireRequest(options, modelOptions, {
    body: {
      input: normalizeInput(context.input),
      instructions: context.instructions,
      max_output_tokens: modelOptions?.maxOutputTokens,
      model: options.model,
      reasoning: modelOptions?.reasoningEffort == null
        ? undefined
        : { effort: modelOptions.reasoningEffort },
      stream: true,
      temperature: modelOptions?.temperature,
      tool_choice: normalizeToolChoice(modelOptions?.toolChoice),
      tools: normalizeTools(context.tools),
      top_p: modelOptions?.topP,
    },
    path: 'responses',
  }, new ResponsesEventStream())
