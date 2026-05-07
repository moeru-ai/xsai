import type { CompletionStep, StopContext } from '../src'

import { describe, expect, it } from 'vitest'

import { hasToolCall, not, or, stepCountAtLeast } from '../src'

const createCompletionStep = (overrides: Partial<CompletionStep> = {}): CompletionStep => ({
  finishReason: 'stop',
  text: undefined,
  toolCalls: [],
  toolResults: [],
  usage: undefined,
  ...overrides,
})

const createStopContext = (overrides: Partial<StopContext> = {}): StopContext => {
  const step = overrides.step ?? createCompletionStep()

  return {
    input: [],
    ...overrides,
    step,
    steps: overrides.steps ?? [step],
  }
}

describe('stopWhen helpers', () => {
  it('stepCountAtLeast uses the accumulated step count', () => {
    expect(stepCountAtLeast(2)(createStopContext({
      steps: [createCompletionStep(), createCompletionStep()],
    }))).toBe(true)

    expect(stepCountAtLeast(3)(createStopContext({
      steps: [createCompletionStep(), createCompletionStep()],
    }))).toBe(false)
  })

  it('hasToolCall can match any tool or a named tool', () => {
    const context = createStopContext({
      step: createCompletionStep({
        toolCalls: [{
          args: '{"location":"Taipei"}',
          toolCallId: 'call_1',
          toolCallType: 'function',
          toolName: 'weather',
        }],
      }),
    })

    expect(hasToolCall()(context)).toBe(true)
    expect(hasToolCall('weather')(context)).toBe(true)
    expect(hasToolCall('search')(context)).toBe(false)
  })

  it('supports composition helpers', () => {
    const context = createStopContext({
      step: createCompletionStep({
        toolCalls: [{
          args: '{}',
          toolCallId: 'call_1',
          toolCallType: 'function',
          toolName: 'finalAnswer',
        }],
      }),
      steps: [createCompletionStep(), createCompletionStep()],
    })

    expect(or(stepCountAtLeast(5), hasToolCall('finalAnswer'))(context)).toBe(true)
    expect(not(hasToolCall('search'))(context)).toBe(true)
  })
})
