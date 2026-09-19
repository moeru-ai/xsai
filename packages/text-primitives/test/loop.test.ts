import type { LanguageModel, LoopStep, StopContext, TextEvent } from '../src'

import { describe, expect, it, vi } from 'vitest'

import { and, hasToolCall, loop, not, or, stepCountAtLeast, tool } from '../src'

const eventStream = (event: TextEvent): ReadableStream<TextEvent> => new ReadableStream<TextEvent>({
  start: (controller) => {
    controller.enqueue(event)
    controller.close()
  },
})

const createLoopStep = (overrides: Partial<LoopStep> = {}): LoopStep => ({
  message: { content: '', role: 'assistant' },
  status: 'completed',
  toolCalls: [],
  toolResults: [],
  ...overrides,
})

const createStopContext = (overrides: Partial<StopContext> = {}): StopContext => {
  const step = overrides.step ?? createLoopStep()

  return {
    input: [],
    step,
    steps: overrides.steps ?? [step],
    ...overrides,
  }
}

describe('loop', () => {
  it('provides the main stopWhen helpers', () => {
    const context = createStopContext({
      step: createLoopStep({
        toolCalls: [{ arguments: '{}', callId: 'call-1', id: 'tool-1', name: 'get_weather', type: 'tool-call' }],
      }),
      steps: [createLoopStep(), createLoopStep()],
    })

    expect(stepCountAtLeast(2)(context)).toBe(true)
    expect(stepCountAtLeast(3)(context)).toBe(false)
    expect(hasToolCall()(context)).toBe(true)
    expect(hasToolCall('get_weather')(context)).toBe(true)
    expect(hasToolCall('search')(context)).toBe(false)
    expect(or(stepCountAtLeast(5), hasToolCall('get_weather'))(context)).toBe(true)
    expect(and(stepCountAtLeast(2), hasToolCall('get_weather'))(context)).toBe(true)
    expect(not(hasToolCall('search'))(context)).toBe(true)
  })

  it('gives stopWhen the accumulated steps including the current step', async () => {
    const weather = tool({
      execute: () => 'sunny',
      inputSchema: { type: 'object' },
      name: 'get_weather',
    })
    const seenStepCounts: number[] = []
    let callCount = 0
    const model: LanguageModel = async () => {
      callCount++
      return eventStream(callCount === 1
        ? {
            message: {
              content: [{ arguments: '{}', callId: 'call-1', id: 'tool-1', name: 'get_weather', type: 'tool-call' }],
              role: 'assistant',
            },
            reason: 'tool-calls',
            status: 'completed',
            type: 'stream.end',
          }
        : {
            message: { content: 'sunny', role: 'assistant' },
            reason: 'stop',
            status: 'completed',
            type: 'stream.end',
          })
    }

    await loop(model, {
      input: 'What is the weather?',
      stopWhen: ({ steps }) => {
        seenStepCounts.push(steps.length)
        return steps.length >= 2
      },
      tools: [weather],
    })

    expect(seenStepCounts).toStrictEqual([1, 2])
  })

  it('passes the loop signal to the executable tool handler', async () => {
    const execute = vi.fn(() => 'sunny')
    const weather = tool({
      execute,
      inputSchema: { type: 'object' },
      name: 'get_weather',
    })
    const controller = new AbortController()
    let callCount = 0
    const model: LanguageModel = async () => {
      callCount++
      return eventStream(callCount === 1
        ? {
            message: {
              content: [{ arguments: '{"city":"Taipei"}', callId: 'call-1', id: 'tool-1', name: 'get_weather', type: 'tool-call' }],
              role: 'assistant',
            },
            reason: 'tool-calls',
            status: 'completed',
            type: 'stream.end',
          }
        : {
            message: { content: 'sunny', role: 'assistant' },
            reason: 'stop',
            status: 'completed',
            type: 'stream.end',
          })
    }

    await loop(model, {
      input: 'What is the weather in Taipei?',
      signal: controller.signal,
      stopWhen: () => false,
      tools: [weather],
    })

    expect(execute).toHaveBeenCalledWith({ city: 'Taipei' }, { signal: controller.signal })
  })
})
