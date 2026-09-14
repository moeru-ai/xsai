import type { HttpOptions } from '@xsai/shared'
import type { LanguageModel } from '@xsai/text-primitives'

import { wireRequest } from '@xsai/text-primitives'

import { ChatEventStream, normalizeInput, normalizeToolChoice, normalizeTools } from './utils'

export type * from './metadata'

export const chat = (options: HttpOptions): LanguageModel => async (context, modelOptions) =>
  wireRequest(options, modelOptions, {
    body: {
      max_tokens: modelOptions?.maxOutputTokens,
      messages: normalizeInput(context),
      model: options.model,
      reasoning_effort: modelOptions?.reasoningEffort,
      stream: true,
      stream_options: { include_usage: true },
      temperature: modelOptions?.temperature,
      tool_choice: normalizeToolChoice(modelOptions?.toolChoice),
      tools: normalizeTools(context.tools),
      top_p: modelOptions?.topP,
    },
    path: 'chat/completions',
  }, new ChatEventStream())
