import type { LanguageModel, TextEvent } from '@xsai/text-primitives'

import { tool, XSAIError } from '@xsai/text-primitives'
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
  it('exposes the full stream and non-delta EventTarget events', async () => {
    const model: LanguageModel = async () => eventStream([
      { type: 'step.start' },
      { contentType: 'text', index: 0, type: 'content.start' },
      { delta: 'hello', index: 0, type: 'text.delta' },
      { content: { text: 'hello', type: 'text' }, index: 0, type: 'content.end' },
      { message: { content: 'hello', role: 'assistant' }, status: 'completed', type: 'step.end' },
    ])

    const run = streamText(model, { input: 'hi' })
    const observed: Event[] = []
    const contentTypes: string[] = []
    let finalStatus: string | undefined

    run.events.addEventListener('step.start', event => observed.push(event))
    run.events.addEventListener('content.start', (event) => {
      contentTypes.push(event.detail.contentType)
      observed.push(event)
    })
    run.events.addEventListener('content.end', event => observed.push(event))
    run.events.addEventListener('step.end', (event) => {
      finalStatus = event.detail.status
      observed.push(event)
    })

    await expect(readEvents(run.stream)).resolves.toEqual([
      { type: 'step.start' },
      { contentType: 'text', index: 0, type: 'content.start' },
      { delta: 'hello', index: 0, type: 'text.delta' },
      { content: { text: 'hello', type: 'text' }, index: 0, type: 'content.end' },
      { message: { content: 'hello', role: 'assistant' }, status: 'completed', type: 'step.end' },
    ])

    expect(observed).toHaveLength(4)
    expect(observed.every(event => event instanceof CustomEvent)).toBe(true)
    expect(contentTypes).toEqual(['text'])
    expect(finalStatus).toBe('completed')
    expect(observed).not.toContainEqual(expect.objectContaining({ type: 'text.delta' }))

    await expect(run.result).resolves.toMatchObject({
      input: [
        { content: 'hi', role: 'user' },
        { content: 'hello', role: 'assistant' },
      ],
      steps: [{ text: 'hello', toolCalls: [], toolResults: [] }],
      text: 'hello',
    })
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
      stopWhen: ({ steps }) => steps.length >= 2,
      tools: [weather],
    })

    await readEvents(run.stream)

    await expect(run.result).resolves.toMatchObject({
      input: [
        { content: 'Use the tool result.', role: 'user' },
        { content: 'sunny', role: 'assistant' },
      ],
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

  it('cancels the model run from the top-level handle', async () => {
    const run = streamText(abortableModel, { input: 'hi' })

    const reason = new Error('stop')
    run.cancel(reason)

    await expect(run.result).rejects.toBe(reason)
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
    await expect(readEvents(run.stream)).resolves.toEqual([])
    expect(called).toBe(false)
  })
})
