export interface Usage {
  cacheCreationInputTokens?: number
  cacheReadInputTokens?: number
  /** Input tokens reported by the wire. */
  inputTokens: number
  outputTokens: number
  reasoningTokens?: number
  /** Total tokens billed by the provider. */
  totalTokens: number
}
