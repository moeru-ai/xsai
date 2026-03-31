import type { FinishReason, ToolCall, Usage } from '@xsai/shared-chat'
import type { EventSourceMessage } from 'eventsource-parser/stream'

import { JSONParseError, RemoteAPIError, StreamChunkParseError } from '@xsai/shared'

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

const parseChunk = (data: string): StreamTextChunkResult => {
  if (data.startsWith('{') && data.includes('"error":')) {
    throw new RemoteAPIError(`Error from server: ${data}`, {
      responseBody: data,
    })
  }

  try {
    return JSON.parse(data) as StreamTextChunkResult
  }
  catch (cause) {
    throw new StreamChunkParseError(`Failed to parse stream chunk: ${data}`, {
      cause: new JSONParseError(`Failed to parse stream chunk JSON: ${data}`, {
        cause,
        text: data,
      }),
      chunk: data,
    })
  }
}

/** @internal */
export const transformChunk = () => {
  return new TransformStream<EventSourceMessage, StreamTextChunkResult>({
    transform: async (chunk, controller) => {
      if (!chunk.data || chunk.data === '[DONE]')
        return

      controller.enqueue(parseChunk(chunk.data))
    },
  })
}
