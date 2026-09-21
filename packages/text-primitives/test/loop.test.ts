import type { LanguageModel, StepResult, StopContext, TextEvent } from '../src'

import { describe, expect, it, vi } from 'vitest'

import { and, hasToolCall, loop, maxSteps, not, or, tool } from '../src'
import { XSAIError } from '../src/shared'

const eventStream = (events: TextEvent | TextEvent[]): ReadableStream<TextEvent> => new ReadableStream<TextEvent>({
  start: (controller) => {
    for (const event of Array.isArray(events) ? events : [events])
      controller.enqueue(event)
    controller.close()
  },
})

const readEvents = async (stream: ReadableStream<TextEvent>): Promise<TextEvent[]> => {
  const events: TextEvent[] = []
  for await (const event of stream)
    events.push(event)
  return events
}

const createStepResult = (overrides: Partial<StepResult> = {}): StepResult => ({
  message: { content: '', role: 'assistant' },
  status: 'completed',
  toolCalls: [],
  toolResults: [],
  ...overrides,
})

const createStopContext = (overrides: Partial<StopContext> = {}): StopContext => {
  const step = overrides.step ?? createStepResult()

  return {
    input: [],
    step,
    steps: overrides.steps ?? [step],
    ...overrides,
  }
}

describe('loop', () => {
  it('returns a stream that forwards model events', async () => {
    let callCount = 0
    const model: LanguageModel = async () => {
      callCount++
      return eventStream([
        { type: 'stream.start' },
        { message: { content: 'Hi', role: 'assistant' }, status: 'completed', type: 'stream.end' },
      ])
    }
    const stream = loop(model, { input: 'hi' })

    expect(stream).toBeInstanceOf(ReadableStream)
    await expect(readEvents(stream)).resolves.toEqual([
      { type: 'stream.start' },
      { message: { content: 'Hi', role: 'assistant' }, status: 'completed', type: 'stream.end' },
    ])
    expect(callCount).toBe(1)
  })

  it('forwards failed terminal events and stops the loop', async () => {
    const error = new XSAIError('model-error', 'server exploded')
    const model: LanguageModel = async () => eventStream([
      { type: 'stream.start' },
      { error, message: { content: [], role: 'assistant' }, status: 'failed', type: 'stream.end' },
    ])

    await expect(readEvents(loop(model, { input: 'hi' }))).resolves.toEqual([
      { type: 'stream.start' },
      { error, message: { content: [], role: 'assistant' }, status: 'failed', type: 'stream.end' },
    ])
  })

  it('rejects truncated model streams', async () => {
    const model: LanguageModel = async () => eventStream({ type: 'stream.start' })

    await expect(readEvents(loop(model, { input: 'hi' }))).rejects.toMatchObject({
      code: 'truncated-stream',
    })
  })

  it('provides the main stopWhen helpers', () => {
    const context = createStopContext({
      step: createStepResult({
        toolCalls: [{ arguments: '{}', callId: 'call-1', id: 'tool-1', name: 'get_weather', type: 'tool-call' }],
      }),
      steps: [createStepResult(), createStepResult()],
    })

    expect(maxSteps(2)(context)).toBe(true)
    expect(maxSteps(3)(context)).toBe(false)
    expect(hasToolCall()(context)).toBe(true)
    expect(hasToolCall('get_weather')(context)).toBe(true)
    expect(hasToolCall('search')(context)).toBe(false)
    expect(or(maxSteps(5), hasToolCall('get_weather'))(context)).toBe(true)
    expect(and(maxSteps(2), hasToolCall('get_weather'))(context)).toBe(true)
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
        ? [
            { type: 'stream.start' },
            {
              message: {
                content: [{ arguments: '{}', callId: 'call-1', id: 'tool-1', name: 'get_weather', type: 'tool-call' }],
                role: 'assistant',
              },
              reason: 'tool-calls',
              status: 'completed',
              type: 'stream.end',
            },
          ]
        : [
            { type: 'stream.start' },
            {
              message: { content: 'sunny', role: 'assistant' },
              reason: 'stop',
              status: 'completed',
              type: 'stream.end',
            },
          ])
    }

    const events = await readEvents(loop(model, {
      input: 'What is the weather?',
      stopWhen: ({ steps }) => {
        seenStepCounts.push(steps.length)
        return steps.length >= 2
      },
      tools: [weather],
    }))

    expect(seenStepCounts).toStrictEqual([1, 2])
    expect(events.filter(event => event.type === 'stream.start')).toHaveLength(2)
    expect(events.filter(event => event.type === 'stream.end')).toHaveLength(2)
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

    await readEvents(loop(model, {
      input: 'What is the weather in Taipei?',
      signal: controller.signal,
      stopWhen: () => false,
      tools: [weather],
    }))

    expect(execute).toHaveBeenCalledWith({ city: 'Taipei' }, { signal: controller.signal })
  })

  it('runs preToolCall and postToolCall around tool execution', async () => {
    const execute = vi.fn((input: unknown) => `weather in ${(input as { city: string }).city}`)
    const weather = tool({
      execute,
      inputSchema: { type: 'object' },
      name: 'get_weather',
    })
    const controller = new AbortController()
    const hooks: unknown[] = []
    const modelInputs: unknown[] = []
    let callCount = 0
    const model: LanguageModel = async (options) => {
      callCount++
      modelInputs.push(options.input)
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
            message: { content: 'done', role: 'assistant' },
            reason: 'stop',
            status: 'completed',
            type: 'stream.end',
          })
    }

    await readEvents(loop(model, {
      input: 'What is the weather?',
      postToolCall: (result, options) => {
        hooks.push(['post', result, options.signal])
        return { ...result, output: 'patched weather' }
      },
      preToolCall: (call, options) => {
        hooks.push(['pre', call, options.signal])
        return { ...call, arguments: '{"city":"Hong Kong"}' }
      },
      signal: controller.signal,
      stopWhen: () => false,
      tools: [weather],
    }))

    expect(execute).toHaveBeenCalledWith({ city: 'Hong Kong' }, { signal: controller.signal })
    expect(hooks).toEqual([
      ['pre', expect.objectContaining({ arguments: '{}', callId: 'call-1' }), controller.signal],
      ['post', expect.objectContaining({ callId: 'call-1', output: 'weather in Hong Kong' }), controller.signal],
    ])
    expect(modelInputs[1]).toEqual(expect.arrayContaining([
      { content: [{ callId: 'call-1', output: 'patched weather', type: 'tool-result' }], role: 'user' },
    ]))
  })

  it('lets preToolCall provide a tool result without executing', async () => {
    const execute = vi.fn(() => 'sunny')
    const postToolCall = vi.fn()
    const weather = tool({
      execute,
      inputSchema: { type: 'object' },
      name: 'get_weather',
    })
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
            message: { content: 'done', role: 'assistant' },
            reason: 'stop',
            status: 'completed',
            type: 'stream.end',
          })
    }

    await readEvents(loop(model, {
      input: 'What is the weather?',
      postToolCall,
      preToolCall: call => ({
        callId: call.callId,
        output: 'not allowed',
        type: 'tool-result',
      }),
      stopWhen: () => false,
      tools: [weather],
    }))

    expect(execute).not.toHaveBeenCalled()
    expect(postToolCall).not.toHaveBeenCalled()
  })
})
