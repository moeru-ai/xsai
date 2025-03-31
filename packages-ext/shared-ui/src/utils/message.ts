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
          return {
            text: 'Unsupported message type',
            type: 'text',
          }
        case 'refusal':
          return {
            refusal: part.refusal,
            type: 'refusal',
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

// eslint-disable-next-line sonarjs/cognitive-complexity
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
      message.content = (message.content as string ?? '') + dataChunk.text
      break
    }
    case 'tool-call':{
      const part = parts.find((part): part is UIMessageToolCallPart => part.type === 'tool-call' && part.status === 'partial' && part.toolCall.index === dataChunk.toolCall.index)
      if (part) {
        part.status = 'loading'
      }
      break
    }
    case 'tool-call-delta':{
      const part = parts.find((part): part is UIMessageToolCallPart => part.type === 'tool-call' && part.status === 'partial' && part.toolCall.index === dataChunk.toolCall.index)
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
    case 'tool-call-result':{
      const part = parts.find((part): part is UIMessageToolCallPart => part.type === 'tool-call' && part.status === 'loading' && part.toolCall.id === dataChunk.id)
      if (part) {
        // eslint-disable-next-line ts/strict-boolean-expressions
        if (dataChunk.error) {
          part.status = 'error'
          part.error = dataChunk.error
          break
        }
        // eslint-disable-next-line ts/strict-boolean-expressions
        if (dataChunk.result) {
          part.status = 'complete'
          part.result = dataChunk.result
          break
        }
      }
      break
    }
    default:
  }
}
