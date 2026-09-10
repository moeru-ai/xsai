import type { Tool } from './tool'
import type { Message } from './types/message'
import type { Model } from './types/model'

export interface TextOptions {
  input: Message[] | string
  instructions?: string
  model: Model
  signal?: AbortSignal
  tools?: Tool[]
}

export const text = async ({ model, ...options }: TextOptions) =>
  model.stream(options)
