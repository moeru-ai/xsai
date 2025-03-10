import type { CommonRequestOptions, StreamTextOptions as XSAIStreamTextOptions, StreamTextResult as XSAIStreamTextResult, Tool as XSAITool } from 'xsai'

import { streamText as xsaiStreamText } from 'xsai'

import type { LanguageModel } from '../types'
import type { MessagesOrPrompts } from '../types/internal/messages-or-prompts'

import { convertPrompts } from './internal/convert-prompts'
import { convertTools } from './internal/convert-tools'

// @ts-expect-error unused generics
// eslint-disable-next-line unused-imports/no-unused-vars
export interface StreamTextResult<T1 = undefined, T2 = undefined> extends XSAIStreamTextResult {}

type StreamTextOptions = MessagesOrPrompts & Omit<XSAIStreamTextOptions, 'tools' | keyof CommonRequestOptions> & {
  model: LanguageModel
  tools?: Record<string, () => Promise<XSAITool>>
}

export const streamText = async (options: StreamTextOptions) => xsaiStreamText({
  ...options,
  ...options.model,
  messages: options.messages ?? convertPrompts(options.prompt!, options.system),
  tools: options.tools
    ? await convertTools(options.tools)
    : undefined,
})
