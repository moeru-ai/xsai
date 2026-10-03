import type { LanguageModel, StepResult, StopContext, TextEvent } from '../src'

import { describe, expect, it, vi } from 'vitest'

import { and, hasToolCall, loop, maxSteps, not, or, TextEventTarget, toCustomEvent, tool } from '../src'
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
  it('observes local tool results once alongside model events', async () => {
    const target = new TextEventTarget()
    const observed: Event[] = []
    for (const type of ['step.start', 'step.end', 'content.start', 'content.end'] as const)
      target.addEventListener(type, event => observed.push(event))
    let stepNumber = 0
    const model: LanguageModel = ({ events }) => {
      const sequence: TextEvent[] = [
        { type: 'step.start' },
        stepNumber++ === 0
          ? {
              message: { content: [{ arguments: '{}', callId: 'call-1', id: 'tool-1', name: 'weather', type: 'tool-call' }], role: 'assistant' },
              reason: 'tool-calls',
              status: 'completed',
              type: 'step.end',
            }
          : { message: { content: 'sunny', role: 'assistant' }, status: 'completed', type: 'step.end' },
      ]
      for (const event of sequence)
        events?.dispatchEvent(toCustomEvent(event))
      return eventStream(sequence)
    }

    await readEvents(loop(model, {
      events: target,
      input: 'weather',
      tools: [tool({ execute: () => 'sunny', inputSchema: { type: 'object' }, name: 'weather' })],
    }))

    expect(observed.map(event => event.type)).toEqual([
      'step.start',
      'step.end',
      'content.start',
      'content.end',
      'step.start',
      'step.end',
    ])
    expect((observed.find(event => event.type === 'content.end') as CustomEvent).detail).toEqual({
      content: { callId: 'call-1', output: 'sunny', type: 'tool-result' },
      index: 0,
    })
  })

  it('ends a provider-only final turn without executing a local tool', async () => {
    const execute = vi.fn(() => 'unexpected')
    const model = vi.fn<LanguageModel>(async () => eventStream({
      message: { content: [
        { key: 'responses', type: 'provider', value: { action: { queries: ['xsai'], type: 'search' }, id: 'ws_1', status: 'completed', type: 'web_search_call' } },
        { text: 'Found', type: 'text' },
      ], role: 'assistant' },
      status: 'completed',
      type: 'step.end',
    }))

    await readEvents(loop(model, { input: 'search', tools: [tool({ execute, inputSchema: { type: 'object' }, name: 'search' })] }))

    expect(model).toHaveBeenCalledTimes(1)
    expect(execute).not.toHaveBeenCalled()
  })

  it('continues provider-only pause turns until stopWhen, keeping the tool declarations', async () => {
    const search = tool({ inputSchema: { type: 'object' }, name: 'local_search' })
    const inputs: unknown[] = []
    const toolsByTurn: unknown[] = []
    const model: LanguageModel = async (options) => {
      inputs.push(structuredClone(options.input))
      toolsByTurn.push(options.tools)
      const number = inputs.length
      const content = [
        ...(number === 1 ? [] : [{ key: 'messages' as const, type: 'provider' as const, value: { content: [], tool_use_id: `srvtoolu_0${number - 1}`, type: 'web_search_tool_result' } }]),
        { key: 'messages' as const, type: 'provider' as const, value: { id: `srvtoolu_0${number}`, input: { query: 'xsai' }, name: 'web_search', type: 'server_tool_use' } },
      ]
      return eventStream({
        message: { content, role: 'assistant' },
        reason: 'pause_turn',
        status: 'completed',
        type: 'step.end',
      })
    }

    const events = await readEvents(loop(model, { input: 'search', stopWhen: maxSteps(3), tools: [search] }))

    expect(events.filter(event => event.type === 'step.end')).toHaveLength(3)
    expect(inputs).toHaveLength(3)
    expect(inputs[1]).toEqual([
      { content: 'search', role: 'user' },
      { content: [{ key: 'messages', type: 'provider', value: { id: 'srvtoolu_01', input: { query: 'xsai' }, name: 'web_search', type: 'server_tool_use' } }], role: 'assistant' },
    ])
    expect(toolsByTurn).toEqual([[search], [search], [search]])
  })

  it('executes only local calls in a mixed provider and local turn', async () => {
    const execute = vi.fn(() => 'sunny')
    const weather = tool({ execute, inputSchema: { type: 'object' }, name: 'weather' })
    const inputs: unknown[] = []
    const model: LanguageModel = async (options) => {
      inputs.push(structuredClone(options.input))
      return eventStream(inputs.length === 1
        ? {
            message: { content: [
              { key: 'messages', type: 'provider', value: { id: 'srvtoolu_01ABC123', input: { url: 'https://example.com' }, name: 'web_fetch', type: 'server_tool_use' } },
              { arguments: '{}', callId: 'call_1', id: 'call_1', name: 'weather', type: 'tool-call' },
            ], role: 'assistant' },
            reason: 'tool-calls',
            status: 'completed',
            type: 'step.end',
          }
        : {
            message: { content: [{ text: 'Done', type: 'text' }], role: 'assistant' },
            status: 'completed',
            type: 'step.end',
          })
    }

    const events = await readEvents(loop(model, { input: 'weather', tools: [weather] }))

    expect(execute).toHaveBeenCalledTimes(1)
    expect(events.filter(event => event.type === 'content.start' && event.contentType === 'tool-result')).toEqual([
      { contentType: 'tool-result', index: 0, type: 'content.start' },
    ])
    expect(events.filter(event => event.type === 'content.end' && event.content.type === 'tool-result')).toEqual([
      { content: { callId: 'call_1', output: 'sunny', type: 'tool-result' }, index: 0, type: 'content.end' },
    ])
    const firstEnd = events.findIndex(event => event.type === 'step.end')
    const toolResult = events.findIndex(event => event.type === 'content.start' && event.contentType === 'tool-result')
    const secondEnd = events.findIndex((event, index) => index > firstEnd && event.type === 'step.end')
    expect(firstEnd).toBeLessThan(toolResult)
    expect(toolResult).toBeLessThan(secondEnd)
    expect(inputs[1]).toEqual([
      { content: 'weather', role: 'user' },
      { content: [
        { key: 'messages', type: 'provider', value: { id: 'srvtoolu_01ABC123', input: { url: 'https://example.com' }, name: 'web_fetch', type: 'server_tool_use' } },
        { arguments: '{}', callId: 'call_1', id: 'call_1', name: 'weather', type: 'tool-call' },
      ], role: 'assistant' },
      { content: [{ callId: 'call_1', output: 'sunny', type: 'tool-result' }], role: 'user' },
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
    expect(callCount).toBe(0)
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

  it('stops without running tools after a model-declared cancellation', async () => {
    const execute = vi.fn(() => 'unexpected')
    const model: LanguageModel = async () => eventStream({
      message: {
        content: [{ arguments: '{}', callId: 'call-1', id: 'tool-1', name: 'weather', type: 'tool-call' }],
        role: 'assistant',
      },
      status: 'cancelled',
      type: 'step.end',
    })

    await expect(readEvents(loop(model, {
      input: 'weather',
      tools: [tool({ execute, inputSchema: { type: 'object' }, name: 'weather' })],
    }))).resolves.toMatchObject([{ status: 'cancelled', type: 'step.end' }])
    expect(execute).not.toHaveBeenCalled()
  })

  it('forwards stream cancellation to the active model reader and step signal', async () => {
    const reading = Promise.withResolvers<void>()
    const modelCancel = vi.fn()
    let preparedSignal: AbortSignal | undefined
    let modelSignal: AbortSignal | undefined
    const model: LanguageModel = async ({ signal }) => {
      modelSignal = signal
      return new ReadableStream<TextEvent>({
        cancel: modelCancel,
        pull: () => reading.resolve(),
      })
    }
    const stream = loop(model, {
      input: 'hi',
      prepareStep: ({ signal }) => { preparedSignal = signal },
    })
    const reader = stream.getReader()
    void reader.read()

    await reading.promise
    const reason = new Error('stop')
    await reader.cancel(reason)

    expect(modelCancel).toHaveBeenCalledWith(reason)
    expect(modelSignal).toBe(preparedSignal)
    expect(modelSignal?.aborted).toBe(true)
    expect(modelSignal?.reason).toBe(reason)
  })

  it('cancels a model stream that arrives after output cancellation', async () => {
    const modelStarted = Promise.withResolvers<void>()
    const modelStream = Promise.withResolvers<ReadableStream<TextEvent>>()
    const modelCancelled = Promise.withResolvers<void>()
    const modelCancel = vi.fn(() => modelCancelled.resolve())
    const model: LanguageModel = async () => {
      modelStarted.resolve()
      return modelStream.promise
    }
    const stream = loop(model, { input: 'hi' })
    const reader = stream.getReader()
    void reader.read()

    await modelStarted.promise
    const cancellation = reader.cancel()
    modelStream.resolve(new ReadableStream<TextEvent>({ cancel: modelCancel }))
    await cancellation
    await modelCancelled.promise

    expect(modelCancel).toHaveBeenCalledOnce()
  })

  it('cancels the model reader and errors the loop stream on external abort', async () => {
    const reading = Promise.withResolvers<void>()
    const modelCancel = vi.fn()
    const controller = new AbortController()
    const model: LanguageModel = async () => new ReadableStream<TextEvent>({
      cancel: modelCancel,
      pull: () => reading.resolve(),
    })
    const events = readEvents(loop(model, { input: 'hi', signal: controller.signal }))

    await reading.promise
    const reason = new Error('external stop')
    controller.abort(reason)

    await expect(events).rejects.toBe(reason)
    expect(modelCancel).toHaveBeenCalledWith(reason)
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
    let loopSignal: AbortSignal | undefined
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
      prepareStep: ({ signal }) => { loopSignal = signal },
      signal: controller.signal,
      stopWhen: () => false,
      tools: [weather],
    }))

    expect(loopSignal).toBeInstanceOf(AbortSignal)
    expect(execute).toHaveBeenCalledWith({ city: 'Taipei' }, { signal: loopSignal })
  })

  it('runs preToolCall and postToolCall around tool execution', async () => {
    const execute = vi.fn((input: unknown) => `weather in ${(input as { city: string }).city}`)
    let loopSignal: AbortSignal | undefined
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
      prepareStep: ({ signal }) => { loopSignal = signal },
      preToolCall: (call, options) => {
        hooks.push(['pre', call, options.signal])
        return { ...call, arguments: '{"city":"Hong Kong"}' }
      },
      signal: controller.signal,
      stopWhen: () => false,
      tools: [weather],
    }))

    expect(loopSignal).toBeInstanceOf(AbortSignal)
    expect(execute).toHaveBeenCalledWith({ city: 'Hong Kong' }, { signal: loopSignal })
    expect(hooks).toEqual([
      ['pre', expect.objectContaining({ arguments: '{}', callId: 'call-1' }), loopSignal],
      ['post', expect.objectContaining({ callId: 'call-1', output: 'weather in Hong Kong' }), loopSignal],
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
