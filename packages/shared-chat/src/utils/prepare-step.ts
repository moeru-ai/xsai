import type { WithUnknown } from '@xsai/shared'

import type { ChatOptions } from './chat'
import type { CompletionStep, Message, PrepareStep, ToolChoice } from '../types'

export interface ResolveStepOptionsOptions extends Pick<WithUnknown<ChatOptions>, 'messages' | 'model' | 'toolChoice'> {
  prepareStep?: PrepareStep
  stepNumber: number
  steps: CompletionStep[]
}

export interface ResolvedStepOptions {
  messages: Message[]
  model: string
  toolChoice: ToolChoice | undefined
}

export const resolveStepOptions = async ({ messages, model, prepareStep, stepNumber, steps, toolChoice }: ResolveStepOptionsOptions): Promise<ResolvedStepOptions> => {
  const prepared = prepareStep == null
    ? undefined
    : await prepareStep({
        messages: structuredClone(messages),
        model,
        stepNumber,
        steps: structuredClone(steps),
      })

  return {
    messages: prepared?.messages != null ? structuredClone(prepared.messages) : messages,
    model: prepared?.model ?? model,
    toolChoice: prepared?.toolChoice ?? toolChoice,
  }
}
