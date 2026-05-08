import type { CommonContentPart, ToolMessage } from '../../types'

// eslint-disable-next-line sonarjs/function-return-type
export const toToolMessageContent = (result: object | string | unknown[]): ToolMessage['content'] => {
  if (typeof result === 'string')
    return result

  if (Array.isArray(result)) {
    // check array type
    if (result.every(item => item !== null && typeof item === 'object' && 'type' in item && ['file', 'image_url', 'input_audio', 'text'].includes((item as { type: string }).type))) {
      return result as CommonContentPart[]
    }
  }

  return JSON.stringify(result)
}
