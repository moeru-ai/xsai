import type { HttpOptions } from '@xsai/shared'
import type { LanguageModel } from '@xsai/text-primitives'

import { wireRequest } from '@xsai/text-primitives'

import { normalizeFormat, normalizeInput, normalizeToolChoice, normalizeTools, ResponsesEventStream } from './utils'

export const responses = (options: HttpOptions): LanguageModel => async modelOptions =>
  wireRequest(options, modelOptions, {
    body: {
      input: normalizeInput(modelOptions.input),
      instructions: modelOptions.instructions,
      max_output_tokens: modelOptions.maxOutputTokens,
      model: options.model,
      reasoning: modelOptions.reasoningEffort == null
        ? undefined
        : { effort: modelOptions.reasoningEffort },
      stream: true,
      temperature: modelOptions.temperature,
      text: normalizeFormat(modelOptions.outputFormat),
      tool_choice: normalizeToolChoice(modelOptions.toolChoice),
      tools: normalizeTools(modelOptions.tools),
      top_p: modelOptions.topP,
    },
    path: 'responses',
  }, new ResponsesEventStream())
