export interface ChatCompletionUsage {
  completion_tokens: number
  prompt_tokens: number
  total_tokens: number
}

export interface Usage {
  inputTokens: number
  outputTokens: number
  totalTokens: number
}
