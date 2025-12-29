import type { Attributes, AttributeValue } from '@opentelemetry/api'
import type { Message } from 'xsai'

const cleanMessages = (m: string) =>
  JSON.stringify((JSON.parse(m) as Message[]).map((message) => {
    if (message.role === 'assistant') {
      message.tool_calls = message.tool_calls?.map(toolCall => ({
        ...toolCall,
        id: '',
      }))
      message.content = ''
    }

    if (message.role === 'tool')
      message.tool_call_id = ''

    return message
  }), null, 2)

export const cleanAttributes = (attributes: Attributes) => Object.fromEntries(
  Object.entries(attributes)
    .map(([key, value]) => {
      if (['gen_ai.response.id', 'gen_ai.tool.call.id'].includes(key))
        return [key, undefined]

      if (['gen_ai.input.messages', 'gen_ai.output.messages'].includes(key))
        return [key, cleanMessages(value as string)]

      return [key, value]
    })
    .filter(([_, v]) => v != null) as [string, AttributeValue][],
)
