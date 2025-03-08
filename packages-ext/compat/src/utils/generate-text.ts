import type { CommonRequestOptions, GenerateTextOptions as XSAIGenerateTextOptions, Tool as XSAITool } from 'xsai'

import { generateText as xsaiGenerateText } from 'xsai'

import type { LanguageModel } from '../types'
import type { MessagesOrPrompts } from '../types/internal/messages-or-prompts'

import { convertPrompts } from './internal/convert-prompts'
import { convertTools } from './internal/convert-tools'

type GenerateTextOptions = MessagesOrPrompts & Omit<XSAIGenerateTextOptions, 'tools' | keyof CommonRequestOptions> & {
  model: LanguageModel
  tools?: Record<string, () => Promise<XSAITool>>
}

export const generateText = async (options: GenerateTextOptions) => xsaiGenerateText({
  ...options,
  ...options.model,
  messages: options.messages ?? convertPrompts(options.prompt!, options.system),
  tools: options.tools
    ? await convertTools(options.tools)
    : undefined,
})
