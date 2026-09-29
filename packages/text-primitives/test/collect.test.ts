import type { LanguageModel, TextEvent } from '../src'

import { describe, expect, it } from 'vitest'

import { collect, loop, tool } from '../src'
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
  it('keeps provider content out of text and local tool results', async () => {
    const provider = { key: 'responses', type: 'provider' as const, value: { action: { queries: ['xsai'], type: 'search' }, id: 'ws_1', status: 'completed', type: 'web_search_call' } }
    const model = modelOf([{
      message: { content: [provider, { text: 'Found', type: 'text' }], role: 'assistant' },
      status: 'completed',
      type: 'step.end',
    }])

    await expect(collect(await model({ input: 'search' }))).resolves.toMatchObject({
      message: { content: [provider, { text: 'Found', type: 'text' }] },
      text: 'Found',
      toolCalls: [],
      toolResults: [],
    })
  })

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

    const result = await collect(await model({ input: 'hi' }))
    expect(result).toMatchObject({
      message: { content: [{ text: 'Hi', type: 'text' }], role: 'assistant' },
      reason: 'stop',
      status: 'completed',
      text: 'Hi',
      toolCalls: [],
      toolResults: [],
      usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
    })
    expect(result.steps).toHaveLength(1)
    expect(result.totalUsage).toMatchObject({ inputTokens: 1, outputTokens: 1, totalTokens: 2 })
  })

  it('derives text and tool calls from the finished message', async () => {
    const toolCall = {
      arguments: '{"city":"Taipei"}',
      callId: 'call-1',
      id: 'tool-1',
      name: 'get_weather',
      type: 'tool-call' as const,
    }
    const model = modelOf([
      {
        message: {
          content: [
            { content: [{ text: 'thinking', type: 'text' as const }], type: 'reasoning' as const },
            { text: 'The weather is ', type: 'text' as const },
            toolCall,
            { text: 'available.', type: 'text' as const },
          ],
          role: 'assistant',
        },
        reason: 'tool-calls',
        status: 'completed',
        type: 'step.end',
      },
    ])

    await expect(collect(await model({ input: 'hi' }))).resolves.toMatchObject({
      message: {
        content: [
          { content: [{ text: 'thinking', type: 'text' }], type: 'reasoning' },
          { text: 'The weather is ', type: 'text' },
          toolCall,
          { text: 'available.', type: 'text' },
        ],
        role: 'assistant',
      },
      reason: 'tool-calls',
      status: 'completed',
      text: 'The weather is available.',
      toolCalls: [toolCall],
      toolResults: [],
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

    const result = await collect(await model({ input: 'hi' }))
    expect(result.status).toBe('completed')
    expect(result.totalUsage).toBeUndefined()
  })

  it('collects loop tool results and usage across steps', async () => {
    let calls = 0
    const model: LanguageModel = async () => {
      calls++
      return eventStream(calls === 1
        ? [{
            message: { content: [{ arguments: '{}', callId: 'call-1', id: 'tool-1', name: 'weather', type: 'tool-call' }], role: 'assistant' },
            status: 'completed',
            type: 'step.end',
            usage: { inputTokens: 2, outputTokens: 3, totalTokens: 5 },
          }]
        : [{
            message: { content: 'sunny', role: 'assistant' },
            status: 'completed',
            type: 'step.end',
            usage: { inputTokens: 4, outputTokens: 1, totalTokens: 5 },
          }])
    }
    const result = await collect(loop(model, {
      input: 'weather',
      tools: [tool({ execute: () => 'sunny', inputSchema: { type: 'object' }, name: 'weather' })],
    }))

    expect(result.text).toBe('sunny')
    expect(result.steps).toHaveLength(2)
    expect(result.steps[0].toolResults).toEqual([{ callId: 'call-1', output: 'sunny', type: 'tool-result' }])
    expect(result.totalUsage).toMatchObject({ inputTokens: 6, outputTokens: 4, totalTokens: 10 })
    expect(result).not.toHaveProperty('input')
  })

  it('rejects with the step.end event\'s typed error when present', async () => {
    const error = new XSAIError('model-error', 'Overloaded', { cause: { type: 'server_error' } })
    const model = modelOf([
      { error, message: { content: [], role: 'assistant' }, status: 'failed', type: 'step.end' },
    ])

    await expect(collect(await model({ input: 'hi' }))).rejects.toBe(error)
  })

  it('waits for the stream to close after step.end', async () => {
    let close!: () => void
    const stream = new ReadableStream<TextEvent>({
      start: (controller) => {
        close = () => controller.close()
        controller.enqueue({
          message: { content: [], role: 'assistant' },
          reason: 'stop',
          status: 'completed',
          type: 'step.end',
        })
      },
    })

    const result = collect(stream)
    let settled = false
    void result.then(() => {
      settled = true
    })
    await Promise.resolve()
    expect(settled).toBe(false)

    close()
    await expect(result).resolves.toMatchObject({ reason: 'stop', status: 'completed' })
  })

  it('propagates stream rejections with their typed error', async () => {
    const error = new XSAIError('truncated-stream', 'wire stream ended without a terminal signal')
    const stream = new ReadableStream<TextEvent>({
      start: (controller) => {
        controller.enqueue({ contentType: 'text', index: 0, type: 'content.start' })
        controller.error(error)
      },
    })

    await expect(collect(stream)).rejects.toBe(error)
  })

  it('rejects with a truncated-stream error when the stream ends without a step.end event', async () => {
    const model = modelOf([
      { contentType: 'text', index: 0, type: 'content.start' },
      { delta: 'Hi', index: 0, type: 'text.delta' },
    ])

    await expect(collect(await model({ input: 'hi' }))).rejects.toMatchObject({
      code: 'truncated-stream',
      message: 'model stream ended without a step.end event',
    })
  })
})
