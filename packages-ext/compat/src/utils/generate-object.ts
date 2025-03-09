import type { CommonRequestOptions, GenerateTextOptions as XSAIGenerateTextOptions, Tool as XSAITool } from 'xsai'
import type { Schema } from 'xsschema'

import { generateObject as xsaiGenerateObject } from 'xsai'

import type { LanguageModel } from '../types'
import type { MessagesOrPrompts } from '../types/internal/messages-or-prompts'

import { convertPrompts } from './internal/convert-prompts'
import { convertTools } from './internal/convert-tools'

type GenerateObjectOptions<T extends Schema> = MessagesOrPrompts & Omit<XSAIGenerateTextOptions, 'tools' | keyof CommonRequestOptions> & {
  model: LanguageModel
  schema: T
  schemaDescription?: string
  schemaName?: string
  tools?: Record<string, () => Promise<XSAITool>>
}

export const generateObject = async <T extends Schema>(options: GenerateObjectOptions<T>) => xsaiGenerateObject({
  ...options,
  ...options.model,
  messages: options.messages ?? convertPrompts(options.prompt!, options.system),
  tools: options.tools
    ? await convertTools(options.tools)
    : undefined,
})
