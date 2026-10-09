import type { DecisionContent, DecisionUsage } from './model'

export const toText = (content: DecisionContent): string =>
  typeof content === 'string' ? content : JSON.stringify(content)

export const toDecisionUsage = (usage: { input_tokens?: null | number, output_tokens?: null | number, total_tokens?: null | number }): DecisionUsage => ({
  inputTokens: usage.input_tokens ?? undefined,
  outputTokens: usage.output_tokens ?? undefined,
  totalTokens: usage.total_tokens ?? (usage.input_tokens != null && usage.output_tokens != null ? usage.input_tokens + usage.output_tokens : undefined),
})
