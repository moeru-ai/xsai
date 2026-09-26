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
  text: '',
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
  it('observes provider results while executing and returning only client calls', async () => {
    const executeSearch = vi.fn()
    const executeWeather = vi.fn(() => 'sunny')
    const preToolCall = vi.fn()
    const postToolCall = vi.fn()
    const inputs: unknown[] = []
    const stepsSeen: StepResult[][] = []
    const model: LanguageModel = async (options) => {
      inputs.push(Array.isArray(options.input) ? [...options.input] : options.input)
      return eventStream(inputs.length === 1
        ? {
            message: { content: [
              { arguments: '{}', callId: 'srv_1', id: 'srv_1', name: 'web_search', providerExecuted: true, type: 'tool-call' },
              { callId: 'srv_1', output: '[{"title":"Forecast"}]', providerExecuted: true, type: 'tool-result' },
              { arguments: '{}', callId: 'local_1', id: 'local_1', name: 'weather', type: 'tool-call' },
            ], role: 'assistant' },
            reason: 'tool-calls',
            status: 'completed',
            type: 'step.end',
          }
        : { message: { content: 'done', role: 'assistant' }, status: 'completed', type: 'step.end' })
    }

    await readEvents(loop(model, {
      input: 'weather?',
      postToolCall,
      preToolCall,
      stopWhen: ({ steps }) => {
        stepsSeen.push([...steps])
        return false
      },
      tools: [
        tool({ execute: executeSearch, inputSchema: { type: 'object' }, name: 'web_search' }),
        tool({ execute: executeWeather, inputSchema: { type: 'object' }, name: 'weather' }),
      ],
    }))

    expect(executeSearch).not.toHaveBeenCalled()
    expect(executeWeather).toHaveBeenCalledOnce()
    expect(preToolCall).toHaveBeenCalledOnce()
    expect(postToolCall).toHaveBeenCalledOnce()
    expect(stepsSeen[0][0].toolResults).toEqual([
      { callId: 'srv_1', output: '[{"title":"Forecast"}]', providerExecuted: true, type: 'tool-result' },
      { callId: 'local_1', output: 'sunny', type: 'tool-result' },
    ])
    expect(inputs[1]).toEqual([
      { content: 'weather?', role: 'user' },
      expect.objectContaining({ role: 'assistant' }),
      { content: [{ callId: 'local_1', output: 'sunny', type: 'tool-result' }], role: 'user' },
    ])
  })

  it('returns a stream that forwards model events', async () => {
    let callCount = 0
    const model: LanguageModel = async () => {
      callCount++
      return eventStream([
        { type: 'step.start' },
        { message: { content: 'Hi', role: 'assistant' }, status: 'completed', type: 'step.end' },
      ])
    }
    const stream = loop(model, { input: 'hi' })

    expect(stream).toBeInstanceOf(ReadableStream)
    await expect(readEvents(stream)).resolves.toEqual([
      { type: 'step.start' },
      { message: { content: 'Hi', role: 'assistant' }, status: 'completed', type: 'step.end' },
    ])
    expect(callCount).toBe(1)
  })

  it('provides a normalized step result to stopWhen', async () => {
    let seenStep: StepResult | undefined
    const model: LanguageModel = async () => eventStream({
      message: { content: [{ text: 'Hi', type: 'text' }], role: 'assistant' },
      status: 'completed',
      type: 'step.end',
    })

    await readEvents(loop(model, {
      input: 'hi',
      stopWhen: ({ step }) => {
        seenStep = step
        return true
      },
    }))

    expect(seenStep).toEqual({
      message: { content: [{ text: 'Hi', type: 'text' }], role: 'assistant' },
      status: 'completed',
      text: 'Hi',
      toolCalls: [],
      toolResults: [],
    })
  })

  it('forwards failed terminal events and stops the loop', async () => {
    const error = new XSAIError('model-error', 'server exploded')
    const model: LanguageModel = async () => eventStream([
      { type: 'step.start' },
      { error, message: { content: [], role: 'assistant' }, status: 'failed', type: 'step.end' },
    ])

    await expect(readEvents(loop(model, { input: 'hi' }))).resolves.toEqual([
      { type: 'step.start' },
      { error, message: { content: [], role: 'assistant' }, status: 'failed', type: 'step.end' },
    ])
  })

  it('rejects truncated model streams', async () => {
    const model: LanguageModel = async () => eventStream({ type: 'step.start' })

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
            { type: 'step.start' },
            {
              message: {
                content: [{ arguments: '{}', callId: 'call-1', id: 'tool-1', name: 'get_weather', type: 'tool-call' }],
                role: 'assistant',
              },
              reason: 'tool-calls',
              status: 'completed',
              type: 'step.end',
            },
          ]
        : [
            { type: 'step.start' },
            {
              message: { content: 'sunny', role: 'assistant' },
              reason: 'stop',
              status: 'completed',
              type: 'step.end',
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
    expect(events.filter(event => event.type === 'step.start')).toHaveLength(2)
    expect(events.filter(event => event.type === 'step.end')).toHaveLength(2)
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
            type: 'step.end',
          }
        : {
            message: { content: 'sunny', role: 'assistant' },
            reason: 'stop',
            status: 'completed',
            type: 'step.end',
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
            type: 'step.end',
          }
        : {
            message: { content: 'done', role: 'assistant' },
            reason: 'stop',
            status: 'completed',
            type: 'step.end',
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
            type: 'step.end',
          }
        : {
            message: { content: 'done', role: 'assistant' },
            reason: 'stop',
            status: 'completed',
            type: 'step.end',
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
