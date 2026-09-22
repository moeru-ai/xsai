import type { LanguageModel, TextEvent } from '../src'

import { describe, expect, it } from 'vitest'

import { collect } from '../src'
import { XSAIError } from '../src/shared'

const eventStream = (events: TextEvent[]): ReadableStream<TextEvent> => new ReadableStream<TextEvent>({
  start: (controller) => {
    for (const event of events)
      controller.enqueue(event)

    controller.close()
  },
})

const modelOf = (events: TextEvent[]): LanguageModel => async () => eventStream(events)

describe('collect', () => {
  it('resolves with the finished message, reason, and usage', async () => {
    const model = modelOf([
      { type: 'step.start' },
      { contentType: 'text', index: 0, type: 'content.start' },
      { delta: 'Hi', index: 0, type: 'text.delta' },
      { content: { text: 'Hi', type: 'text' }, index: 0, type: 'content.end' },
      {
        message: { content: [{ text: 'Hi', type: 'text' }], role: 'assistant' },
        reason: 'stop',
        status: 'completed',
        type: 'step.end',
        usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
      },
    ])

    await expect(collect(model, { input: 'hi' })).resolves.toEqual({
      message: { content: [{ text: 'Hi', type: 'text' }], role: 'assistant' },
      reason: 'stop',
      status: 'completed',
      usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
    })
  })

  it('resolves with the step.end event\'s normalized status', async () => {
    const model = modelOf([
      {
        message: { content: [], role: 'assistant' },
        reason: 'stop',
        status: 'completed',
        type: 'step.end',
      },
    ])

    await expect(collect(model, { input: 'hi' })).resolves.toMatchObject({
      status: 'completed',
    })
  })

  it('rejects with the step.end event\'s typed error when present', async () => {
    const error = new XSAIError('model-error', 'Overloaded', { cause: { type: 'server_error' } })
    const model = modelOf([
      { error, message: { content: [], role: 'assistant' }, status: 'failed', type: 'step.end' },
    ])

    await expect(collect(model, { input: 'hi' })).rejects.toBe(error)
  })

  it('resolves on the step.end event without waiting for the stream to close', async () => {
    const model: LanguageModel = async () => new ReadableStream<TextEvent>({
      start: (controller) => {
        controller.enqueue({
          message: { content: [], role: 'assistant' },
          reason: 'stop',
          status: 'completed',
          type: 'step.end',
        })
      },
    })

    await expect(collect(model, { input: 'hi' })).resolves.toMatchObject({ reason: 'stop', status: 'completed' })
  })

  it('propagates stream rejections with their typed error', async () => {
    const error = new XSAIError('truncated-stream', 'wire stream ended without a terminal signal')
    const model: LanguageModel = async () => new ReadableStream<TextEvent>({
      start: (controller) => {
        controller.enqueue({ contentType: 'text', index: 0, type: 'content.start' })
        controller.error(error)
      },
    })

    await expect(collect(model, { input: 'hi' })).rejects.toBe(error)
  })

  it('rejects with a truncated-stream error when the stream ends without a step.end event', async () => {
    const model = modelOf([
      { contentType: 'text', index: 0, type: 'content.start' },
      { delta: 'Hi', index: 0, type: 'text.delta' },
    ])

    await expect(collect(model, { input: 'hi' })).rejects.toMatchObject({
      code: 'truncated-stream',
      message: 'model stream ended without a step.end event',
    })
  })
})
