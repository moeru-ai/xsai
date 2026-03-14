import type { StopContext, StopStep } from '../src'

import { describe, expect, it } from 'vitest'

import { determineStepType, hasToolCall, not, or, stepCountAtLeast } from '../src'

const createStopStep = (overrides: Partial<StopStep> = {}): StopStep => ({
  finishReason: 'stop',
  text: undefined,
  toolCalls: [],
  toolResults: [],
  usage: undefined,
  ...overrides,
})

const createStopContext = (overrides: Partial<StopContext> = {}): StopContext => {
  const step = overrides.step ?? createStopStep()

  return {
    messages: [],
    ...overrides,
    step,
    steps: overrides.steps ?? [step],
  }
}

describe('stopWhen helpers', () => {
  it('stepCountAtLeast uses the accumulated step count', () => {
    expect(stepCountAtLeast(2)(createStopContext({
      steps: [createStopStep(), createStopStep()],
    }))).toBe(true)

    expect(stepCountAtLeast(3)(createStopContext({
      steps: [createStopStep(), createStopStep()],
    }))).toBe(false)
  })

  it('hasToolCall can match any tool or a named tool', () => {
    const context = createStopContext({
      step: createStopStep({
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
      step: createStopStep({
        toolCalls: [{
          args: '{}',
          toolCallId: 'call_1',
          toolCallType: 'function',
          toolName: 'finalAnswer',
        }],
      }),
      steps: [createStopStep(), createStopStep()],
    })

    expect(or(stepCountAtLeast(5), hasToolCall('finalAnswer'))(context)).toBe(true)
    expect(not(hasToolCall('search'))(context)).toBe(true)
  })
})

describe('determineStepType', () => {
  it('marks the first step as initial', () => {
    expect(determineStepType({
      finishReason: 'stop',
      stepsLength: 0,
      toolCallsLength: 0,
      willContinue: false,
    })).toBe('initial')
  })

  it('marks continued tool loops as tool-result', () => {
    expect(determineStepType({
      finishReason: 'tool_calls',
      stepsLength: 1,
      toolCallsLength: 1,
      willContinue: true,
    })).toBe('tool-result')
  })

  it('marks non-tool continuation as continue', () => {
    expect(determineStepType({
      finishReason: 'stop',
      stepsLength: 1,
      toolCallsLength: 0,
      willContinue: true,
    })).toBe('continue')
  })

  it('marks finished steps as done when no next step exists', () => {
    expect(determineStepType({
      finishReason: 'stop',
      stepsLength: 1,
      toolCallsLength: 0,
      willContinue: false,
    })).toBe('done')
  })
})
