import { chatCompletion, type ChatCompletionOptions, type FinishReason } from '@xsai/shared-chat-completion'

export interface StreamTextOptions extends ChatCompletionOptions {
  streamOptions?: {
    /**
     * Return usage.
     * @default `undefined`
     * @remarks Ollama doesn't support this, see {@link https://github.com/ollama/ollama/issues/5200}
     */
    usage?: boolean
  }
}

export interface StreamTextResponseUsage {
  completion_tokens: number
  prompt_tokens: number
  total_tokens: number
}

export interface StreamTextResult {
  finishReason?: FinishReason
  textStream: ReadableStream<string>
  usage?: StreamTextResponseUsage
}

export interface StreamTextResponse {
  choices: {
    delta: {
      content: string
      role: 'assistant'
    }
    finish_reason?: FinishReason
    index: number
  }[]
  created: number
  id: string
  model: string
  object: 'chat.completion.chunk'
  system_fingerprint: string
  usage?: StreamTextResponseUsage
}

/**
 * @experimental
 * WIP, currently only returns `textStream`, does not support function calling (tools).
 */
export const streamText = async (options: StreamTextOptions): Promise<StreamTextResult> =>
  await chatCompletion({
    ...options,
    stream: true,
  })
    .then((res) => {
      if (!res.body) {
        return Promise.reject(res)
      }

      const decoder = new TextDecoder()

      let finishReason: string | undefined
      let usage: StreamTextResponseUsage | undefined

      const textStream = res.body.pipeThrough(new TransformStream({
        transform: (chunk, controller) => {
          for (const line of decoder.decode(chunk).split('\n').filter(line => line)) {
            if (line !== 'data: [DONE]') {
              const data: StreamTextResponse = JSON.parse(line.slice(6))

              controller.enqueue(data.choices[0].delta.content)

              if (data.choices[0].finish_reason) {
                finishReason = data.choices[0].finish_reason
              }

              if (data.usage)
                usage = data.usage
            }
            else {
              controller.terminate()
            }
          }
        },
      }))

      return { finishReason, textStream, usage }
    })

export default streamText
