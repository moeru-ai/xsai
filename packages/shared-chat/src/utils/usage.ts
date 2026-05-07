import type { ChatCompletionUsage, Usage } from '../types'

export const normalizeChatCompletionUsage = (usage: ChatCompletionUsage): Usage => ({
  inputTokens: usage.prompt_tokens,
  outputTokens: usage.completion_tokens,
  totalTokens: usage.total_tokens,
})
