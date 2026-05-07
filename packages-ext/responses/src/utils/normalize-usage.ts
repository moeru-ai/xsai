import type { Usage } from '@xsai/shared-chat'

import type { ResponseResource } from '../generated'

export const normalizeUsage = (usage: NonNullable<ResponseResource['usage']>): Usage => ({
  inputTokens: usage.input_tokens,
  outputTokens: usage.output_tokens,
  totalTokens: usage.total_tokens,
})
