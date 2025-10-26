import type { StreamTranscriptionDelta } from ".."

/** @internal */
const parseChunk = (text: string): [StreamTranscriptionDelta | undefined, boolean] => {
  if (!text || !text.startsWith('data:'))
    return [undefined, false]

  // Extract content after "data:" prefix
  const content = text.slice('data:'.length) // Remove leading single space if present
  const data = content.startsWith(' ') ? content.slice(1) : content
  // Handle special cases
  if (data.includes('[DONE]')) {
    return [undefined, true]
  }

  if (data.startsWith('{') && data.includes('"error":')) {
    throw new Error(`Error from server: ${data}`)
  }

  // Process normal chunk
  const chunk = JSON.parse(data) as StreamTranscriptionDelta

  return [chunk, false]
}

/** @internal */
export const transformChunk = () => {
  const decoder = new TextDecoder()
  let buffer = ''

  return new TransformStream<Uint8Array, StreamTranscriptionDelta>({
    transform: async (chunk, controller) => {
      const text = decoder.decode(chunk, { stream: true })
      buffer += text
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      // Process complete lines
      for (const line of lines) {
        try {
          const [chunk, isEnd] = parseChunk(line)
          if (isEnd)
            break

          if (chunk) {
            controller.enqueue(chunk)
          }
        }
        catch (error) {
          controller.error(error)
        }
      }
    },
  })
}
