import type { CommonRequestOptions, StreamObjectResult as XSAIStreamObjectResult, StreamTextOptions as XSAIStreamTextOptions, Tool as XSAITool } from 'xsai'
import type { Schema } from 'xsschema'

import { streamObject as xsaiStreamObject } from 'xsai'

import type { LanguageModel } from '../types'
import type { MessagesOrPrompts } from '../types/internal/messages-or-prompts'

import { convertPrompts } from './internal/convert-prompts'
import { convertTools } from './internal/convert-tools'

type StreamObjectOptions<T extends Schema> = MessagesOrPrompts & Omit<XSAIStreamTextOptions, 'tools' | keyof CommonRequestOptions> & {
  model: LanguageModel
  schema: T
  schemaDescription?: string
  schemaName?: string
  tools?: Record<string, () => Promise<XSAITool>>
}

export const streamObject = async <T extends Schema>(options: StreamObjectOptions<T>): Promise<XSAIStreamObjectResult<T>> => xsaiStreamObject({
  ...options,
  ...options.model,
  messages: options.messages ?? convertPrompts(options.prompt!, options.system),
  tools: options.tools
    ? await convertTools(options.tools)
    : undefined,
})
