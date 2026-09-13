import type { Event, LanguageModel, StreamResult } from '../src'

import { describe, expect, it } from 'vitest'

import { collect, EventCollectStream } from '../src'
import { XSAIError } from '../src/shared'

const eventStream = (events: Event[]): ReadableStream<Event> => new ReadableStream<Event>({
  start: (controller) => {
    for (const event of events)
      controller.enqueue(event)

    controller.close()
  },
})

const modelOf = (events: Event[]): LanguageModel => async () => eventStream(events)

const collectSnapshots = async (events: Event[]): Promise<StreamResult[]> => {
  const results: StreamResult[] = []
  for await (const result of eventStream(events).pipeThrough(new EventCollectStream()))
    results.push(result)
  return results
}

describe('event collect stream', () => {
  it('accumulates deltas into the in-progress message', async () => {
    const results = await collectSnapshots([
      { contentType: 'text', index: 0, type: 'content.start' },
      { delta: 'Hel', index: 0, type: 'text.delta' },
      { delta: 'lo', index: 0, type: 'text.delta' },
      { content: { text: 'Hello', type: 'text' }, index: 0, type: 'content.end' },
      {
        message: { content: [{ text: 'Hello', type: 'text' }], id: 'msg_1', role: 'assistant' },
        reason: 'stop',
        type: 'finish',
        usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
      },
    ])

    expect(results.map(result => result.message.content)).toEqual([
      [{ text: '', type: 'text' }],
      [{ text: 'Hel', type: 'text' }],
      [{ text: 'Hello', type: 'text' }],
      [{ text: 'Hello', type: 'text' }],
      [{ text: 'Hello', type: 'text' }],
    ])
    expect(results[4]).toMatchObject({
      message: { content: [{ text: 'Hello', type: 'text' }], id: 'msg_1', role: 'assistant' },
      reason: 'stop',
      usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
    })
  })

  it('accumulates tool-call arguments and identity across deltas', async () => {
    const results = await collectSnapshots([
      { contentType: 'tool-call', index: 0, type: 'content.start' },
      { delta: '{"a":', id: 'call_1', index: 0, name: 'f', type: 'tool-call.delta' },
      { delta: '1}', id: 'call_1', index: 0, type: 'tool-call.delta' },
      {
        content: { arguments: '{"a":1}', callId: 'call_1', id: 'call_1', name: 'f', type: 'tool-call' },
        index: 0,
        type: 'content.end',
      },
      {
        message: {
          content: [{ arguments: '{"a":1}', callId: 'call_1', id: 'call_1', name: 'f', type: 'tool-call' }],
          role: 'assistant',
        },
        reason: 'tool-calls',
        type: 'finish',
      },
    ])

    expect(results[1].message.content).toEqual([
      { arguments: '{"a":', callId: 'call_1', id: 'call_1', name: 'f', type: 'tool-call' },
    ])
    expect(results[2].message.content).toEqual([
      { arguments: '{"a":1}', callId: 'call_1', id: 'call_1', name: 'f', type: 'tool-call' },
    ])
    expect(results[4].reason).toBe('tool-calls')
  })

  it('exposes the terminating error on the finished snapshot', async () => {
    const error = new XSAIError('model-error', 'server exploded', { cause: { type: 'server_error' } })
    const results = await collectSnapshots([
      { error, message: { content: [], role: 'assistant' }, reason: 'error', type: 'finish' },
    ])

    expect(results[0].terminalError).toBe(error)
  })
})

describe('collect', () => {
  it('resolves with the finished message, reason, and usage', async () => {
    const model = modelOf([
      { contentType: 'text', index: 0, type: 'content.start' },
      { delta: 'Hi', index: 0, type: 'text.delta' },
      { content: { text: 'Hi', type: 'text' }, index: 0, type: 'content.end' },
      {
        message: { content: [{ text: 'Hi', type: 'text' }], role: 'assistant' },
        reason: 'stop',
        type: 'finish',
        usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
      },
    ])

    await expect(collect(model, { input: 'hi' })).resolves.toEqual({
      message: { content: [{ text: 'Hi', type: 'text' }], role: 'assistant' },
      reason: 'stop',
      usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
    })
  })

  it('rejects with the finish event\'s typed error when present', async () => {
    const error = new XSAIError('model-error', 'Overloaded', { cause: { type: 'server_error' } })
    const model = modelOf([
      { error, message: { content: [], role: 'assistant' }, reason: 'error', type: 'finish' },
    ])

    await expect(collect(model, { input: 'hi' })).rejects.toBe(error)
  })

  it('rejects with a typed model error when the stream finishes with an error', async () => {
    const model = modelOf([
      { message: { content: [], role: 'assistant' }, reason: 'error', type: 'finish' },
    ])

    await expect(collect(model, { input: 'hi' })).rejects.toMatchObject({
      code: 'model-error',
      message: 'model stream failed',
    })
  })

  it('resolves on the finish event without waiting for the stream to close', async () => {
    const model: LanguageModel = async () => new ReadableStream<Event>({
      start: (controller) => {
        controller.enqueue({
          message: { content: [], role: 'assistant' },
          reason: 'stop',
          type: 'finish',
        })
        // never closes
      },
    })

    await expect(collect(model, { input: 'hi' })).resolves.toMatchObject({ reason: 'stop' })
  })

  it('propagates stream rejections with their typed error', async () => {
    const error = new XSAIError('truncated-stream', 'wire stream ended without a terminal signal')
    const model: LanguageModel = async () => new ReadableStream<Event>({
      start: (controller) => {
        controller.enqueue({ contentType: 'text', index: 0, type: 'content.start' })
        controller.error(error)
      },
    })

    await expect(collect(model, { input: 'hi' })).rejects.toBe(error)
  })

  it('rejects with a truncated-stream error when the stream ends without a finish event', async () => {
    const model = modelOf([
      { contentType: 'text', index: 0, type: 'content.start' },
      { delta: 'Hi', index: 0, type: 'text.delta' },
    ])

    await expect(collect(model, { input: 'hi' })).rejects.toMatchObject({
      code: 'truncated-stream',
      message: 'model stream ended without a finish event',
    })
  })
})
