import type { LanguageModel, TextEvent } from '@xsai/text'

import { TextEventTarget, tool, withEventTarget, XSAIError } from '@xsai/text'
import { describe, expect, it } from 'vitest'

import { streamText } from '../src'

const eventStream = (events: TextEvent[]): ReadableStream<TextEvent> => new ReadableStream<TextEvent>({
  start: (controller) => {
    for (const event of events)
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

const abortableModel: LanguageModel = async ({ signal }) => new ReadableStream<TextEvent>({
  start: (streamController) => {
    signal?.addEventListener('abort', () => streamController.error(signal.reason), { once: true })
  },
})

describe('streamText', () => {
  it('returns only the stream and result', async () => {
    const model: LanguageModel = () => eventStream([
      { message: { content: 'Done', role: 'assistant' }, status: 'completed', type: 'step.end' },
    ])
    const run = streamText(model, { input: 'hi' })

    expect(Object.keys(run)).toHaveLength(2)
    expect(run).not.toHaveProperty('events')
    await run.result
  })

  it('passes raw event detail directly to CustomEvent listeners', async () => {
    const detail = { item_id: 'ws_1', type: 'response.web_search_call.searching' }
    const target = new TextEventTarget()
    const observed: unknown[] = []
    target.addEventListener('raw', event => observed.push(event.detail))
    const model: LanguageModel = async () => eventStream([
      { detail, type: 'raw' },
      { message: { content: 'Done', role: 'assistant' }, status: 'completed', type: 'step.end' },
    ])
    const run = streamText(model, { input: 'hi' })

    await readEvents(run.stream.pipeThrough(withEventTarget(target)))

    expect(observed).toEqual([detail])
    expect(observed[0]).toBe(detail)
    await expect(run.result).resolves.toMatchObject({ text: 'Done' })
  })

  it('finishes the result before the output stream is read', async () => {
    const sequence: TextEvent[] = [
      { type: 'step.start' },
      { message: { content: 'Done', role: 'assistant' }, status: 'completed', type: 'step.end' },
    ]
    const model: LanguageModel = async () => eventStream(sequence)
    const run = streamText(model, { input: 'hi' })

    const result = await run.result
    expect(result).toMatchObject({ steps: [{ text: 'Done' }], text: 'Done' })
    expect(result.totalUsage).toBeUndefined()
    await expect(readEvents(run.stream)).resolves.toEqual(sequence)
  })

  it('exposes the full stream through EventTarget events', async () => {
    const target = new TextEventTarget()
    const model: LanguageModel = async () => eventStream([
      { type: 'step.start' },
      { contentType: 'text', index: 0, type: 'content.start' },
      { delta: 'hello', index: 0, type: 'text.delta' },
      { content: { text: 'hello', type: 'text' }, index: 0, type: 'content.end' },
      { message: { content: 'hello', role: 'assistant' }, status: 'completed', type: 'step.end' },
    ])

    const observed: Event[] = []
    const contentTypes: string[] = []
    let finalStatus: string | undefined

    target.addEventListener('step.start', event => observed.push(event))
    target.addEventListener('content.start', (event) => {
      contentTypes.push(event.detail.contentType)
      observed.push(event)
    })
    target.addEventListener('text.delta', (event) => {
      expect(event.detail).toEqual({ delta: 'hello', index: 0 })
      observed.push(event)
    })
    target.addEventListener('content.end', event => observed.push(event))
    target.addEventListener('step.end', (event) => {
      finalStatus = event.detail.status
      observed.push(event)
    })
    const run = streamText(model, { input: 'hi' })

    await expect(readEvents(run.stream.pipeThrough(withEventTarget(target)))).resolves.toEqual([
      { type: 'step.start' },
      { contentType: 'text', index: 0, type: 'content.start' },
      { delta: 'hello', index: 0, type: 'text.delta' },
      { content: { text: 'hello', type: 'text' }, index: 0, type: 'content.end' },
      { message: { content: 'hello', role: 'assistant' }, status: 'completed', type: 'step.end' },
    ])

    expect(observed.map(event => event.type)).toEqual([
      'step.start',
      'content.start',
      'text.delta',
      'content.end',
      'step.end',
    ])
    expect(observed.every(event => event instanceof CustomEvent)).toBe(true)
    expect(contentTypes).toEqual(['text'])
    expect(finalStatus).toBe('completed')
    await expect(run.result).resolves.toMatchObject({
      steps: [{ text: 'hello', toolCalls: [], toolResults: [] }],
      text: 'hello',
    })
  })

  it('exposes reasoning, refusal, and tool call deltas through EventTarget', async () => {
    const target = new TextEventTarget()
    const model: LanguageModel = async () => eventStream([
      { delta: 'thinking', index: 0, type: 'reasoning.delta' },
      { delta: 'cannot', index: 1, type: 'refusal.delta' },
      { callId: 'call-1', delta: '{"city":', index: 2, name: 'weather', type: 'tool-call.delta' },
      { message: { content: '', role: 'assistant' }, status: 'completed', type: 'step.end' },
    ])
    const details: unknown[] = []

    target.addEventListener('reasoning.delta', event => details.push(event.detail))
    target.addEventListener('refusal.delta', event => details.push(event.detail))
    target.addEventListener('tool-call.delta', event => details.push(event.detail))
    const run = streamText(model, { input: 'hi' })

    await readEvents(run.stream.pipeThrough(withEventTarget(target)))

    expect(details).toEqual([
      { delta: 'thinking', index: 0 },
      { delta: 'cannot', index: 1 },
      { callId: 'call-1', delta: '{"city":', index: 2, name: 'weather' },
    ])
    await expect(run.result).resolves.toMatchObject({ text: '' })
  })

  it('resolves aggregate step results after executing tools', async () => {
    const weather = tool({
      execute: () => 'sunny',
      inputSchema: { type: 'object' },
      name: 'get_weather',
    })
    let callCount = 0
    const model: LanguageModel = async () => {
      callCount++
      return eventStream(callCount === 1
        ? [{
            message: {
              content: [{ arguments: '{}', callId: 'call-1', id: 'tool-1', name: 'get_weather', type: 'tool-call' }],
              role: 'assistant',
            },
            reason: 'tool-calls',
            status: 'completed',
            type: 'step.end',
          }]
        : [{
            message: { content: 'sunny', role: 'assistant' },
            reason: 'stop',
            status: 'completed',
            type: 'step.end',
          }])
    }

    const run = streamText(model, {
      input: 'What is the weather?',
      prepareStep: ({ stepNumber }) => stepNumber === 1 ? { input: 'Use the tool result.' } : undefined,
      tools: [weather],
    })

    await readEvents(run.stream)

    await expect(run.result).resolves.toMatchObject({
      steps: [
        {
          text: '',
          toolResults: [{ callId: 'call-1', output: 'sunny', type: 'tool-result' }],
        },
        { text: 'sunny', toolResults: [] },
      ],
      text: 'sunny',
    })
  })

  it('keeps tool errors in the completed step', async () => {
    let callCount = 0
    const model: LanguageModel = async () => {
      callCount++
      return eventStream(callCount === 1
        ? [{
            message: {
              content: [{ arguments: '{}', callId: 'call-1', id: 'tool-1', name: 'missing', type: 'tool-call' }],
              role: 'assistant',
            },
            reason: 'tool-calls',
            status: 'completed',
            type: 'step.end',
          }]
        : [{ message: { content: 'done', role: 'assistant' }, status: 'completed', type: 'step.end' }])
    }

    const run = streamText(model, { input: 'Call a tool.', stopWhen: ({ steps }) => steps.length >= 2 })

    await readEvents(run.stream)

    await expect(run.result).resolves.toMatchObject({
      steps: [{
        toolResults: [{
          callId: 'call-1',
          isError: true,
          type: 'tool-result',
        }],
      }, { text: 'done' }],
    })
  })

  it('rejects the result for a failed terminal event while closing the stream', async () => {
    const error = new XSAIError('model-error', 'model failed')
    const model: LanguageModel = async () => eventStream([
      { type: 'step.start' },
      { error, message: { content: '', role: 'assistant' }, status: 'failed', type: 'step.end' },
    ])
    const run = streamText(model, { input: 'hi' })

    await expect(readEvents(run.stream)).resolves.toHaveLength(2)
    await expect(run.result).rejects.toBe(error)
  })

  it('cancels the model run from the output stream', async () => {
    const reading = Promise.withResolvers<void>()
    let cancelledReason: unknown
    const model: LanguageModel = async () => new ReadableStream<TextEvent>({
      cancel: (reason) => { cancelledReason = reason },
      pull: () => reading.resolve(),
    })
    const run = streamText(model, { input: 'hi' })

    await reading.promise
    const reason = new Error('stop')
    await run.stream.cancel(reason)

    expect(cancelledReason).toBe(reason)
    await expect(run.result).rejects.toBe(reason)
  })

  it('rejects the result with AbortError when cancelled without a reason', async () => {
    const reading = Promise.withResolvers<void>()
    const model: LanguageModel = async () => new ReadableStream<TextEvent>({ pull: () => reading.resolve() })
    const run = streamText(model, { input: 'hi' })

    await reading.promise
    await run.stream.cancel()

    await expect(run.result).rejects.toMatchObject({ name: 'AbortError' })
  })

  it('cancels the model run when the input signal aborts', async () => {
    const controller = new AbortController()
    const run = streamText(abortableModel, { input: 'hi', signal: controller.signal })

    await Promise.resolve()
    const reason = new Error('external stop')
    controller.abort(reason)

    await expect(run.result).rejects.toBe(reason)
  })

  it('does not start a model for a pre-aborted signal', async () => {
    const controller = new AbortController()
    const reason = new Error('already stopped')
    controller.abort(reason)
    let called = false
    const model: LanguageModel = async () => {
      called = true
      return eventStream([{ message: { content: 'unreachable', role: 'assistant' }, status: 'completed', type: 'step.end' }])
    }
    const run = streamText(model, { input: 'hi', signal: controller.signal })

    await expect(run.result).rejects.toBe(reason)
    await expect(readEvents(run.stream)).rejects.toBe(reason)
    expect(called).toBe(false)
  })
})
