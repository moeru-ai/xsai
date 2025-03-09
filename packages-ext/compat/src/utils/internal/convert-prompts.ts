import type { Message as XSAIMessage } from 'xsai'

export const convertPrompts = (prompt: string, system?: string): XSAIMessage[] => [
  ...(system !== undefined
    ? [{
      content: system,
      role: 'system',
    } satisfies XSAIMessage]
    : []
  ),
  {
    content: prompt,
    role: 'user',
  },
]
