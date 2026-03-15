import type { AnthropicMessage, AnthropicToolResultBlockParam, AnthropicToolUseBlock } from './anthropic-message'
import type { AnthropicStopReason, FinishReason } from './finish-reason'
import type { Usage } from './usage'

export interface Step {
  finishReason: FinishReason
  message: AnthropicMessage
  reasoningText?: string
  stopReason: AnthropicStopReason | null
  text?: string
  toolResults: AnthropicToolResultBlockParam[]
  toolUses: AnthropicToolUseBlock[]
  usage?: Usage
}
