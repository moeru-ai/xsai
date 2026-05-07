import type { ChatCompletionUsage, Usage } from '../types'

export const computeTotalUsage = (totalUsage: undefined | Usage, usage: Usage): Usage =>
  totalUsage == null
    ? usage
    : {
        inputTokens: totalUsage.inputTokens + usage.inputTokens,
        outputTokens: totalUsage.outputTokens + usage.outputTokens,
        totalTokens: totalUsage.totalTokens + usage.totalTokens,
      }

export const normalizeChatCompletionUsage = (usage: ChatCompletionUsage): Usage => ({
  inputTokens: usage.prompt_tokens,
  outputTokens: usage.completion_tokens,
  totalTokens: usage.total_tokens,
})
