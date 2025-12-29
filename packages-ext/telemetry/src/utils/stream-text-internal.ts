import type { FinishReason, ToolCall, Usage } from 'xsai'

export interface StreamTextChunkResult {
  choices: {
    delta: {
      content?: string
      /** @remarks OpenAI doesn't support this, but some providers do. */
      reasoning_content?: string
      refusal?: string
      role: 'assistant'
      tool_calls?: (ToolCall & { index: number })[]
    }
    finish_reason?: FinishReason
    index: number
  }[]
  created: number
  id: string
  model: string
  object: 'chat.completion.chunk'
  system_fingerprint: string
  usage?: Usage
}

/** @internal */
const parseChunk = (text: string): [StreamTextChunkResult | undefined, boolean] => {
  if (!text || !text.startsWith('data:'))
    return [undefined, false]

  // Extract content after "data:" prefix
  const content = text.slice('data:'.length)
  // Remove leading single space if present
  const data = content.startsWith(' ') ? content.slice(1) : content

  // Handle special cases
  if (data === '[DONE]') {
    return [undefined, true]
  }

  if (data.startsWith('{') && data.includes('"error":')) {
    throw new Error(`Error from server: ${data}`)
  }

  // Process normal chunk
  const chunk = JSON.parse(data) as StreamTextChunkResult

  return [chunk, false]
}

/** @internal */
export const transformChunk = () => {
  const decoder = new TextDecoder()
  let buffer = ''

  return new TransformStream<Uint8Array, StreamTextChunkResult>({
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
