import type { Event, LanguageModel } from '../src'

import { describe, expect, it } from 'vitest'

import { collect } from '../src'
import { XSAIError } from '../src/shared'

const eventStream = (events: Event[]): ReadableStream<Event> => new ReadableStream<Event>({
  start: (controller) => {
    for (const event of events)
      controller.enqueue(event)

    controller.close()
  },
})

const modelOf = (events: Event[]): LanguageModel => async () => eventStream(events)

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

  it('resolves with the finish event\'s response identity', async () => {
    const model = modelOf([
      {
        message: { content: [], role: 'assistant' },
        reason: 'stop',
        responseId: 'resp_1',
        responseStatus: 'completed',
        type: 'finish',
      },
    ])

    await expect(collect(model, { input: 'hi' })).resolves.toMatchObject({
      responseId: 'resp_1',
      responseStatus: 'completed',
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
