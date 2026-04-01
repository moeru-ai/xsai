import type { EventSourceMessage } from 'eventsource-parser/stream'

import { JSONParseError, RemoteAPIError } from '@xsai/shared'

export interface ParseJsonSSEMessageOptions<T> {
  doneMarker?: string
  isErrorResponse?: (data: string) => boolean
  parse?: (data: string) => T
}

const defaultIsErrorResponse = (data: string) => data.startsWith('{') && data.includes('"error":')

export const parseJsonSSEMessage = <T>(
  message: EventSourceMessage,
  options: ParseJsonSSEMessageOptions<T> = {},
): T | undefined => {
  const { data } = message

  if (!data)
    return

  if (data === (options.doneMarker ?? '[DONE]'))
    return

  if ((options.isErrorResponse ?? defaultIsErrorResponse)(data)) {
    throw new RemoteAPIError(`Error from server: ${data}`, {
      responseBody: data,
    })
  }

  try {
    return (options.parse ?? JSON.parse)(data) as T
  }
  catch (cause) {
    throw new JSONParseError(`Failed to parse stream chunk JSON: ${data}`, {
      cause,
      text: data,
    })
  }
}

export class JsonMessageTransformStream<T> extends TransformStream<EventSourceMessage, T> {
  constructor(options: ParseJsonSSEMessageOptions<T> = {}) {
    super({
      transform: (chunk, controller) => {
        try {
          const data = parseJsonSSEMessage(chunk, options)

          if (data != null)
            controller.enqueue(data)
        }
        catch (error) {
          controller.error(error)
        }
      },
    })
  }
}
