import type { EventSourceMessage } from 'eventsource-parser/stream'

import { JSONParseError, RemoteAPIError } from '@xsai/shared'

export interface ParseJsonSSEMessageOptions<T> {
  doneMarker?: string
  isErrorResponse?: (parsed: T) => boolean
  parse?: (data: string) => T
}

const defaultIsErrorResponse = (parsed: unknown) =>
  parsed != null
  && typeof parsed === 'object'
  && 'error' in parsed

export const parseJsonSSEMessage = <T>(
  message: EventSourceMessage,
  options: ParseJsonSSEMessageOptions<T> = {},
): T | undefined => {
  const { data } = message

  if (!data)
    return

  if (data === (options.doneMarker ?? '[DONE]'))
    return

  let parsed: T

  try {
    parsed = (options.parse ?? JSON.parse)(data) as T
  }
  catch (cause) {
    throw new JSONParseError(`Failed to parse stream chunk JSON: ${data}`, {
      cause,
      text: data,
    })
  }

  if ((options.isErrorResponse ?? defaultIsErrorResponse)(parsed)) {
    throw new RemoteAPIError(`Error from server: ${data}`, {
      responseBody: data,
    })
  }

  return parsed
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
