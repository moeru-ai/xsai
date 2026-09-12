export interface Usage {
  cacheCreationInputTokens?: number
  cacheReadInputTokens?: number
  /** The wire's input figure verbatim — includes cache reads on OpenAI-compatible wires, excludes them on Anthropic. */
  inputTokens: number
  outputTokens: number
  reasoningTokens?: number
  /** Normalized total of every token the provider billed. */
  totalTokens: number
}
