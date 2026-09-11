import type { Tool } from './tool'
import type { LanguageModel } from './types/language-model'
import type { Message } from './types/message'

export interface TextOptions {
  input: Message[] | string
  instructions?: string
  model: LanguageModel
  signal?: AbortSignal
  tools?: Tool[]
}

export const text = async ({ model, ...options }: TextOptions) =>
  model(options)
