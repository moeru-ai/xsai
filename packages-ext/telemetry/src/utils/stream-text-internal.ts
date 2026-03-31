import type { EventSourceMessage } from 'eventsource-parser/stream'
import type { FinishReason, ToolCall, Usage } from 'xsai'

export interface StreamTextChunkResult {
  choices: {
    delta: {
      content?: string
      /** @see {@link https://cookbook.openai.com/articles/gpt-oss/handle-raw-cot#chat-completions-api} */
      reasoning?: string
      /** @remarks OpenAI doesn't support this, but some providers do. */
      reasoning_content?: string
      refusal?: string
      role: 'assistant'
      tool_calls?: ToolCall[]
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
export const transformChunk = () => {
  return new TransformStream<EventSourceMessage, StreamTextChunkResult>({
    transform: async (chunk, controller) => {
      if (!chunk.data || chunk.data === '[DONE]')
        return

      if (chunk.data.startsWith('{') && chunk.data.includes('"error":'))
        throw new Error(`Error from server: ${chunk.data}`)

      controller.enqueue(JSON.parse(chunk.data) as StreamTextChunkResult)
    },
  })
}
