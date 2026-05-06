import type { Attributes, AttributeValue } from '@opentelemetry/api'
import type { Message } from 'xsai'

const normalizeJSON = (value: unknown): unknown => {
  if (Array.isArray(value))
    return value.map(normalizeJSON)

  if (value != null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => [key, normalizeJSON(value)]),
    )
  }

  return value
}

const cleanJSON = (value: string | undefined) => {
  if (value == null)
    return value

  try {
    return JSON.stringify(normalizeJSON(JSON.parse(value)))
  }
  catch {
    return value
  }
}

const cleanMessages = (m: string) =>
  JSON.stringify((JSON.parse(m) as Message[]).map((message) => {
    if (message.role === 'assistant') {
      message.tool_calls = message.tool_calls?.map(toolCall => ({
        ...toolCall,
        function: {
          ...toolCall.function,
          arguments: cleanJSON(toolCall.function.arguments),
        },
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
      if (['gen_ai.response.id', 'gen_ai.tool.call.id', 'gen_ai.usage.output_tokens'].includes(key))
        return [key, undefined]

      if (['gen_ai.input.messages', 'gen_ai.output.messages'].includes(key))
        return [key, cleanMessages(value as string)]

      if (key === 'gen_ai.tool.call.arguments')
        return [key, cleanJSON(value as string)]

      return [key, value]
    })
    .filter(([_, v]) => v != null) as [string, AttributeValue][],
)
