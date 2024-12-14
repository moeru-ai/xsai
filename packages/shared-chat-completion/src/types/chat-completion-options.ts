import type { CommonRequestOptions } from '@xsai/shared'

import type { Message } from './message'
import type { ToolChoice } from './tool-choice'

export interface ChatCompletionOptions extends CommonRequestOptions {
  [key: string]: unknown
  maxRoundTrip?: number
  messages: Message[]
  toolChoice?: ToolChoice
}
