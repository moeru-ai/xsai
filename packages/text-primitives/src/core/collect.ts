import type { StepResult } from './types/step-result'
import type { TextEvent } from './types/text-event'
import type { Usage } from './types/usage'

import { XSAIError } from '@xsai/shared'

import { toStepResult } from './step-result'

export interface CollectResult extends StepResult {
  steps: readonly StepResult[]
  totalUsage?: Usage
}

const totalUsage = (steps: readonly StepResult[]): undefined | Usage => {
  const usages = steps.flatMap(step => step.usage == null ? [] : [step.usage])
  if (usages.length === 0)
    return undefined

  const sum = (key: keyof Usage): number | undefined => {
    const values = usages.map(usage => usage[key]).filter((value): value is number => value != null)
    return values.length === 0 ? undefined : values.reduce((total, value) => total + value, 0)
  }
  return {
    cacheCreationInputTokens: sum('cacheCreationInputTokens'),
    cacheReadInputTokens: sum('cacheReadInputTokens'),
    inputTokens: sum('inputTokens') ?? 0,
    outputTokens: sum('outputTokens') ?? 0,
    reasoningTokens: sum('reasoningTokens'),
    totalTokens: sum('totalTokens') ?? 0,
  }
}

/** Adds a completed step or local tool result to the collected steps. @internal */
export const collectEvent = (steps: StepResult[], event: TextEvent): unknown => {
  if (event.type === 'step.end') {
    if (event.status === 'failed')
      return event.error
    steps.push(toStepResult(event))
  }
  else if (event.type === 'content.end' && event.content.type === 'tool-result') {
    const step = steps.at(-1)
    if (step == null)
      throw new XSAIError('protocol-error', 'tool result arrived before a step.end event')
    step.toolResults.push(event.content)
  }
}

/** Builds the result after a stream has closed. @internal */
export const collectResult = (steps: StepResult[]): CollectResult => {
  const finalStep = steps.at(-1)
  if (finalStep == null)
    throw new XSAIError('truncated-stream', 'model stream ended without a step.end event')

  return {
    ...finalStep,
    steps,
    totalUsage: totalUsage(steps),
  }
}

export const collect = async (stream: ReadableStream<TextEvent>): Promise<CollectResult> => {
  const steps: StepResult[] = []
  let failedError: unknown

  for await (const event of stream)
    failedError ??= collectEvent(steps, event)

  if (failedError != null)
    throw failedError

  return collectResult(steps)
}
