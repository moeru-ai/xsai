import type { TrampolineFn } from '@xsai/shared'
import type { ChatOptions, CompletionStep, CompletionToolCall, CompletionToolResult, FinishReason, Message, Usage } from '@xsai/shared-chat'

import { responseJSON, trampoline } from '@xsai/shared'
import { chat } from '@xsai/shared-chat'

import type { GenerateTextResponse } from './extract-generate-text-step'

import { extractGenerateTextStep } from './extract-generate-text-step'

export interface GenerateTextOptions extends ChatOptions {
  /** @default 1 */
  maxSteps?: number
  onStepFinish?: (step: CompletionStep<true>) => Promise<unknown> | unknown
  /** @internal */
  steps?: CompletionStep<true>[]
  /** if you want to enable stream, use `@xsai/stream-{text,object}` */
  stream?: never
}

export interface GenerateTextResult {
  finishReason: FinishReason
  messages: Message[]
  reasoningText?: string
  steps: CompletionStep<true>[]
  text?: string
  toolCalls: CompletionToolCall[]
  toolResults: CompletionToolResult[]
  usage: Usage
}

/** @internal */
const rawGenerateText = async (options: GenerateTextOptions): Promise<TrampolineFn<GenerateTextResult>> =>
  chat({
    ...options,
    maxSteps: undefined,
    steps: undefined,
    stream: false,
  })
    .then(responseJSON<GenerateTextResponse>)
    .then(async (res) => {
      const messages: Message[] = structuredClone(options.messages)
      const steps: CompletionStep<true>[] = options.steps ? structuredClone(options.steps) : []

      const [step, { messages: msgs, reasoningText }] = await extractGenerateTextStep({
        ...options,
        messages,
        steps,
      }, res)

      steps.push(step)
      messages.push(...msgs)

      if (options.onStepFinish)
        await options.onStepFinish(step)

      if (step.finishReason === 'stop' || step.stepType === 'done') {
        return {
          finishReason: step.finishReason,
          messages,
          reasoningText,
          steps,
          text: step.text,
          toolCalls: step.toolCalls,
          toolResults: step.toolResults,
          usage: step.usage,
        }
      }
      else {
        return async () => rawGenerateText({
          ...options,
          messages,
          steps,
        })
      }
    })

export const generateText = async (options: GenerateTextOptions): Promise<GenerateTextResult> =>
  trampoline<GenerateTextResult>(async () => rawGenerateText(options))
