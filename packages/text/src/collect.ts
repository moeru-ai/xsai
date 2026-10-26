import type { StepResult } from './types/step-result'
import type { TextEvent } from './types/text-event'
import type { Usage } from './types/usage'

import { XSAIError } from '@xsai/shared'

import { toStepResult } from './utils/step-result'

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

export const collect = async (stream: ReadableStream<TextEvent>): Promise<CollectResult> => {
  const steps: StepResult[] = []
  let failedError: unknown

  for await (const event of stream) {
    if (failedError != null)
      continue
    if (event.type === 'step.end') {
      if (event.status === 'failed')
        failedError = event.error
      else
        steps.push(toStepResult(event))
      continue
    }
    if (event.type !== 'content.end' || event.content.type !== 'tool-result')
      continue
    const step = steps.at(-1)
    if (step == null)
      throw new XSAIError('protocol-error', 'tool result arrived before a step.end event')
    step.toolResults.push(event.content)
  }

  if (failedError != null)
    throw failedError

  const finalStep = steps.at(-1)
  if (finalStep == null)
    throw new XSAIError('truncated-stream', 'model stream ended without a step.end event')

  return {
    ...finalStep,
    steps,
    totalUsage: totalUsage(steps),
  }
}
