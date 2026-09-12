export interface Usage {
  cacheCreationInputTokens?: number
  cacheReadInputTokens?: number
  inputTokens: number
  outputTokens: number
  reasoningTokens?: number
  totalTokens: number
}
