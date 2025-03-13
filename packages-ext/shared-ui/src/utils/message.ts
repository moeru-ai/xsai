import type { Message } from '@xsai/shared-chat'

import type { StreamTextDataChunk } from '../../../../packages/xsai/src'
import type { UIMessage, UIMessagePart, UIMessageToolCallPart } from '../types'

export const extractUIMessageParts = (message: Message): UIMessagePart[] => {
  if (message.content === undefined) {
    return []
  }

  if (typeof message.content === 'string') {
    return [
      {
        text: message.content,
        type: 'text',
      },
    ]
  }

  // TODO: support more types

  return []
}

export const accumulateDataChunk = (message: UIMessage, dataChunk: StreamTextDataChunk) => {
  const parts = message.parts
  switch (dataChunk.type) {
    case 'text-delta':{
      const part = parts.find(part => part.type === 'text')
      if (part) {
        part.text += dataChunk.text
      }
      else {
        parts.push({ text: dataChunk.text, type: 'text' })
      }
      break
    }
    case 'tool-call':{
      const part = parts.find((part): part is UIMessageToolCallPart => part.type === 'tool-call' && part.toolCall.id === dataChunk.toolCall.id)
      if (part) {
        part.status = 'ready'
      }
      break
    }
    case 'tool-call-delta':{
      const part = parts.find((part): part is UIMessageToolCallPart => part.type === 'tool-call' && part.status === 'partial' && part.toolCall.id === dataChunk.toolCall.id)
      if (part) {
        part.toolCall.function.arguments += dataChunk.toolCall.function.arguments
      }
      else {
        parts.push({
          status: 'partial',
          toolCall: {
            ...dataChunk.toolCall,
          },
          type: 'tool-call',
        })
      }
      break
    }
    case 'error':
    case 'finish':
    case 'reasoning':
    case 'refusal':
    default:
  }
}
