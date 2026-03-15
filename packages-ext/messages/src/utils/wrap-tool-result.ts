import type { AnthropicTextBlockParam } from '../types/anthropic-message'
import type { ToolExecuteResult } from '../types/anthropic-tool'

const isTextBlockParam = (value: unknown): value is AnthropicTextBlockParam =>
  typeof value === 'object'
  && value != null
  && 'type' in value
  && 'text' in value
  && (value as { type: unknown }).type === 'text'

// eslint-disable-next-line sonarjs/function-return-type
export const wrapToolResult = (result: ToolExecuteResult): AnthropicTextBlockParam[] | string => {
  if (typeof result === 'string')
    return result

  if (Array.isArray(result) && result.every(isTextBlockParam))
    return result

  return JSON.stringify(result)
}
