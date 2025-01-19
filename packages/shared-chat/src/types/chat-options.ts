import type { CommonRequestOptions } from '@xsai/shared'
import type { Tool } from '@xsai/tool'

import type { Message } from './message'
import type { ToolChoice } from './tool-choice'

export interface ChatOptions extends CommonRequestOptions {
  [key: string]: unknown
  messages: Message[]
  toolChoice?: ToolChoice
  tools?: Tool<never>[]
}
