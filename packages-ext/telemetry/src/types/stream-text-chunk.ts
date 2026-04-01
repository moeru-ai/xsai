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
