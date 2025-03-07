import type { ToolMessagePart } from '../types'

// eslint-disable-next-line sonarjs/function-return-type
export const wrapToolResult = (result: object | string | unknown[]): string | ToolMessagePart[] => {
  if (typeof result === 'string')
    return result

  if (Array.isArray(result)) {
    // check array type
    if (result.every(item => !!(typeof item === 'object' && 'type' in item && ['audio', 'image', 'text'].includes((item as { type: string }).type)))) {
      // eslint-disable-next-line @masknet/type-prefer-return-type-annotation
      return result as ToolMessagePart[]
    }
  }

  return JSON.stringify(result)
}
