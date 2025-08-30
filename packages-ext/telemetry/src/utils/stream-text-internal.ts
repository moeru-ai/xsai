import type { FinishReason, ToolCall, Usage } from 'xsai'

export interface StreamTextChunkResult {
  choices: {
    delta: {
      content?: string
      /** @remarks OpenAI does not support this, but LiteLLM / DeepSeek does. */
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

export class DelayedPromise<T> {
  get promise(): Promise<T> {
    if (this._promise == null) {
      this._promise = new Promise<T>((resolve, reject) => {
        if (this.status.type === 'resolved') {
          resolve(this.status.value)
        }
        else if (this.status.type === 'rejected') {
          reject(this.status.error)
        }

        this._resolve = resolve
        this._reject = reject
      })
    }

    return this._promise
  }

  private _promise: Promise<T> | undefined
  private _reject: ((error: unknown) => void) | undefined
  private _resolve: ((value: T) => void) | undefined

  private status:
    | { error: unknown, type: 'rejected' }
    | { type: 'pending' }
    | { type: 'resolved', value: T } = { type: 'pending' }

  reject(error: unknown): void {
    this.status = { error, type: 'rejected' }

    if (this._promise) {
      this._reject?.(error)
    }
  }

  resolve(value: T): void {
    this.status = { type: 'resolved', value }

    if (this._promise) {
      this._resolve?.(value)
    }
  }
}
