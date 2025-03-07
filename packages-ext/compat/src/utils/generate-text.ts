import type { ChatOptions, CommonRequestOptions, GenerateTextOptions as XSAIGenerateTextOptions, Tool as XSAITool } from 'xsai'

import { generateText as xsaiGenerateText } from 'xsai'

import type { LanguageModel } from '../types'

import { convertTools } from './internal/convert-tools'

interface GenerateTextOptions extends Omit<XSAIGenerateTextOptions, 'tools' | keyof CommonRequestOptions> {
  // make ts happy
  messages: ChatOptions['messages']
  model: LanguageModel
  tools?: Record<string, () => Promise<XSAITool>>
}

export const generateText = async (options: GenerateTextOptions) => xsaiGenerateText({
  ...options,
  ...options.model,
  tools: options.tools
    ? await convertTools(options.tools)
    : undefined,
})
