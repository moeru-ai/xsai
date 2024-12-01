import type { CommonRequestOptions } from '@xsai/shared'

import type { ChatCompletionModel } from './chat-completion-model'
import type { Message } from './message'
import type { ToolChoice } from './tool-choice'

export interface ChatCompletionOptions extends CommonRequestOptions<'chat/completions'> {
  [key: string]: unknown
  messages: Message[]
  model: ChatCompletionModel
  toolChoice?: ToolChoice
}
