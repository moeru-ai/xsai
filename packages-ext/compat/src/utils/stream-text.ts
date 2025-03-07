import type { ChatOptions, CommonRequestOptions, StreamTextOptions as XSAIStreamTextOptions, Tool as XSAITool } from 'xsai'

import { streamText as xsaiStreamText } from 'xsai'

import type { LanguageModel } from '../types'

import { convertTools } from './internal/convert-tools'

interface StreamTextOptions extends Omit<XSAIStreamTextOptions, 'tools' | keyof CommonRequestOptions> {
  // make ts happy
  messages: ChatOptions['messages']
  model: LanguageModel
  tools?: Record<string, () => Promise<XSAITool>>
}

export const streamText = async (options: StreamTextOptions) => xsaiStreamText({
  ...options,
  ...options.model,
  tools: options.tools
    ? await convertTools(options.tools)
    : undefined,
})
