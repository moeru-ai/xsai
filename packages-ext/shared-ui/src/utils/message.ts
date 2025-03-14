import type { Message, StreamTextDataChunk } from '@xsai/shared-chat'

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

  if (Array.isArray(message.content)) {
    return message.content.map((part): null | UIMessagePart => {
      switch (part.type) {
        case 'image_url':
        case 'input_audio':
        case 'refusal':
          return {
            text: 'Unsupported message type',
            type: 'text',
          }
        case 'text':
          return {
            text: part.text,
            type: 'text',
          }
        default:
      }
      return null
    }).filter((part): part is UIMessagePart => part !== null)
  }

  return []
}

export const accumulateDataChunk = (message: UIMessage, dataChunk: StreamTextDataChunk) => {
  const parts = message.parts
  // eslint-disable-next-line ts/switch-exhaustiveness-check
  switch (dataChunk.type) {
    case 'reasoning':{
      const part = parts.find(part => part.type === 'reasoning')
      if (part) {
        part.reasoning += dataChunk.reasoning
      }
      else {
        parts.push({ reasoning: dataChunk.reasoning, type: 'reasoning' })
      }
      // TODO: add reasoning to the message for next time submit
      // message.reasoning += dataChunk.reasoning
      break
    }
    case 'text-delta':{
      const part = parts.find(part => part.type === 'text')
      if (part) {
        part.text += dataChunk.text
      }
      else {
        parts.push({ text: dataChunk.text, type: 'text' })
      }
      message.content = (message.content as string) + dataChunk.text
      break
    }
    case 'tool-call':{
      const part = parts.find((part): part is UIMessageToolCallPart => part.type === 'tool-call' && part.status === 'partial' && part.toolCall.id === dataChunk.toolCall.id)
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
    default:
  }
}
