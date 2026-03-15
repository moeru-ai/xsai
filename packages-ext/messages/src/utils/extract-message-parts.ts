import type { AnthropicContentBlock, AnthropicMessage, AnthropicThinkingBlock, AnthropicToolUseBlock } from '../types/anthropic-message'

export const getToolUses = (message: AnthropicMessage): AnthropicToolUseBlock[] =>
  message.content.filter((content): content is AnthropicToolUseBlock => content.type === 'tool_use')

export const getText = (message: AnthropicMessage): string | undefined => {
  const text = message.content
    .filter((content): content is Extract<AnthropicContentBlock, { type: 'text' }> => content.type === 'text')
    .map(content => content.text)
    .join('')

  return text.length > 0 ? text : undefined
}

export const getReasoningText = (message: AnthropicMessage): string | undefined => {
  const reasoningText = message.content
    .filter((content): content is AnthropicThinkingBlock => content.type === 'thinking')
    .map(content => content.thinking)
    .join('')

  return reasoningText.length > 0 ? reasoningText : undefined
}
