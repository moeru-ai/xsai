import type { TextEvent } from '../src'

import { describe, expect, it } from 'vitest'

import { eventBuilder, WireEventStream } from '../src'
import { XSAIError } from '../src/shared'

describe('eventBuilder', () => {
  it('preserves an empty reasoning part when no delta arrives', () => {
    const events: TextEvent[] = []
    const failures: XSAIError[] = []
    const builder = eventBuilder(event => events.push(event), error => failures.push(error))

    builder.start('reasoning', 'reasoning')
    builder.done('completed', 'stop')
    builder.flush()

    const reasoning = { content: [{ text: '', type: 'text' }], type: 'reasoning' }
    expect(events).toEqual([
      { contentType: 'reasoning', index: 0, type: 'content.start' },
      { content: reasoning, index: 0, type: 'content.end' },
      { message: { content: [reasoning], role: 'assistant' }, reason: 'stop', status: 'completed', type: 'stream.end' },
    ])
    expect(failures).toEqual([])
  })

  it('assembles refusal parts', () => {
    const events: TextEvent[] = []
    const builder = eventBuilder(event => events.push(event), () => {})

    builder.start('refusal', 'refusal')
    builder.delta('refusal', 'I cannot')
    builder.delta('refusal', ' help')
    builder.end('refusal')
    builder.done('completed', 'stop')
    builder.flush()

    const refusal = { refusal: 'I cannot help', type: 'refusal' }
    expect(events).toEqual([
      { contentType: 'refusal', index: 0, type: 'content.start' },
      { delta: 'I cannot', index: 0, type: 'refusal.delta' },
      { delta: ' help', index: 0, type: 'refusal.delta' },
      { content: refusal, index: 0, type: 'content.end' },
      { message: { content: [refusal], role: 'assistant' }, reason: 'stop', status: 'completed', type: 'stream.end' },
    ])
  })

  it('does not carry response-level identity on the stream.end event', () => {
    const events: TextEvent[] = []
    const builder = eventBuilder(event => events.push(event), () => {})

    builder.meta({ messageId: 'msg_1' })
    builder.done('completed', 'stop')
    builder.flush()

    expect(events).toEqual([
      {
        message: { content: [], id: 'msg_1', role: 'assistant' },
        reason: 'stop',
        status: 'completed',
        type: 'stream.end',
      },
    ])
  })

  it('backfills a streamed message id onto an override message without one', () => {
    const events: TextEvent[] = []
    const builder = eventBuilder(event => events.push(event), () => {})

    builder.meta({ messageId: 'msg_1' })
    builder.done('completed', 'stop', { content: [{ text: 'Hi', type: 'text' }], role: 'assistant' })
    builder.flush()

    expect(events).toEqual([
      {
        message: { content: [{ text: 'Hi', type: 'text' }], id: 'msg_1', role: 'assistant' },
        reason: 'stop',
        status: 'completed',
        type: 'stream.end',
      },
    ])
  })

  it('prefers the override message id over a streamed one', () => {
    const events: TextEvent[] = []
    const builder = eventBuilder(event => events.push(event), () => {})

    builder.meta({ messageId: 'msg_streamed' })
    builder.done('completed', 'stop', { content: [], id: 'msg_terminal', role: 'assistant' })
    builder.flush()

    expect(events).toEqual([
      {
        message: { content: [], id: 'msg_terminal', role: 'assistant' },
        reason: 'stop',
        status: 'completed',
        type: 'stream.end',
      },
    ])
  })

  it('keeps unknown reasons as strings', () => {
    const events: TextEvent[] = []
    const builder = eventBuilder(event => events.push(event), () => {})

    builder.start('tool', 'tool-call', { callId: 'call_1', id: 'call_1', name: 'weather' })
    builder.delta('tool', '{}')
    builder.done('completed', 'provider_finished')
    builder.flush()

    expect(events.at(-1)).toEqual({
      message: {
        content: [{ arguments: '{}', callId: 'call_1', id: 'call_1', name: 'weather', type: 'tool-call' }],
        role: 'assistant',
      },
      reason: 'provider_finished',
      status: 'completed',
      type: 'stream.end',
    })
  })

  it('keeps provider item ids separate from tool-call delta ids', () => {
    const events: TextEvent[] = []
    const builder = eventBuilder(event => events.push(event), () => {})

    builder.start('tool', 'tool-call', {
      fallbackId: 'call_0',
      id: 'item_0',
      name: 'weather',
    })
    builder.delta('tool', '{}')
    builder.end('tool')

    expect(events).toContainEqual({
      delta: '{}',
      id: 'call_0',
      index: 0,
      name: 'weather',
      type: 'tool-call.delta',
    })
    expect(events).toContainEqual({
      content: {
        arguments: '{}',
        callId: 'call_0',
        id: 'item_0',
        name: 'weather',
        type: 'tool-call',
      },
      index: 0,
      type: 'content.end',
    })
  })

  it('ignores an empty initial call id when resolving a tool-call delta id', () => {
    const events: TextEvent[] = []
    const builder = eventBuilder(event => events.push(event), () => {})

    builder.start('tool', 'tool-call', {
      callId: '',
      fallbackId: 'call_0',
      name: 'weather',
    })
    builder.delta('tool', '{}')

    expect(events).toContainEqual({
      delta: '{}',
      id: 'call_0',
      index: 0,
      name: 'weather',
      type: 'tool-call.delta',
    })
  })

  it('upgrades an explicit stop to tool-calls when the final message contains a tool call', () => {
    const events: TextEvent[] = []
    const builder = eventBuilder(event => events.push(event), () => {})

    builder.start('tool', 'tool-call', { callId: 'call_1', id: 'call_1', name: 'weather' })
    builder.delta('tool', '{}')
    builder.done('completed', 'stop')
    builder.flush()

    expect(events.at(-1)).toMatchObject({ reason: 'tool-calls', status: 'completed' })
  })

  it('checks an override message when reconciling tool-call stops', () => {
    const events: TextEvent[] = []
    const builder = eventBuilder(event => events.push(event), () => {})

    builder.done('completed', 'stop', {
      content: [{ arguments: '{}', callId: 'call_1', id: 'call_1', name: 'weather', type: 'tool-call' }],
      role: 'assistant',
    })
    builder.flush()

    expect(events.at(-1)).toMatchObject({ reason: 'tool-calls', status: 'completed' })
  })

  it('does not infer tool calls for incomplete terminal statuses', () => {
    const events: TextEvent[] = []
    const builder = eventBuilder(event => events.push(event), () => {})

    builder.start('tool', 'tool-call', { callId: 'call_1', id: 'call_1', name: 'weather' })
    builder.delta('tool', '{}')
    builder.done('incomplete')
    builder.flush()

    expect(events.at(-1)).toEqual({
      message: {
        content: [{ arguments: '{}', callId: 'call_1', id: 'call_1', name: 'weather', type: 'tool-call' }],
        role: 'assistant',
      },
      status: 'incomplete',
      type: 'stream.end',
    })
  })

  it('does not use streamed tool calls when an override message omits them', () => {
    const events: TextEvent[] = []
    const builder = eventBuilder(event => events.push(event), () => {})

    builder.start('tool', 'tool-call', { callId: 'call_1', id: 'call_1', name: 'weather' })
    builder.delta('tool', '{}')
    builder.done('completed', 'stop', { content: [{ text: 'done', type: 'text' }], role: 'assistant' })
    builder.flush()

    expect(events.at(-1)).toEqual({
      message: { content: [{ text: 'done', type: 'text' }], role: 'assistant' },
      reason: 'stop',
      status: 'completed',
      type: 'stream.end',
    })
  })

  it('carries the terminating error on the stream.end event', () => {
    const events: TextEvent[] = []
    const builder = eventBuilder(event => events.push(event), () => {})
    const error = new XSAIError('model-error', 'server exploded', { cause: { type: 'server_error' } })

    builder.fail(error)
    expect(events).toEqual([
      { error, message: { content: [], role: 'assistant' }, status: 'failed', type: 'stream.end' },
    ])

    builder.flush()
    expect(events).toHaveLength(1)
  })

  it('carries a partial message on a failed terminal event', () => {
    const events: TextEvent[] = []
    const builder = eventBuilder(event => events.push(event), () => {})
    const error = new XSAIError('model-error', 'server exploded')
    const message = { content: [{ text: 'partial', type: 'text' as const }], role: 'assistant' as const }

    builder.fail(error, message)
    builder.flush()

    expect(events).toEqual([{ error, message, status: 'failed', type: 'stream.end' }])
  })

  it('keeps the first terminal state: a later finish cannot replace the recorded error', () => {
    const events: TextEvent[] = []
    const builder = eventBuilder(event => events.push(event), () => {})
    const error = new XSAIError('model-error', 'server exploded')

    builder.fail(error)
    builder.done('completed', 'stop')
    builder.flush()

    expect(events).toEqual([
      { error, message: { content: [], role: 'assistant' }, status: 'failed', type: 'stream.end' },
    ])
  })

  it('fails the stream when the wire ends without a terminal signal', () => {
    const events: TextEvent[] = []
    const failures: XSAIError[] = []
    const builder = eventBuilder(event => events.push(event), error => failures.push(error))

    builder.start('text', 'text')
    builder.delta('text', 'Hi')
    builder.flush()

    expect(failures).toHaveLength(1)
    expect(failures[0]).toMatchObject({ code: 'truncated-stream' })
    expect(events).toEqual([
      { contentType: 'text', index: 0, type: 'content.start' },
      { delta: 'Hi', index: 0, type: 'text.delta' },
    ])
  })

  it('normalizes mapper failures as protocol errors', async () => {
    const source = new ReadableStream<string>({
      start: (controller) => {
        controller.enqueue('{}')
        controller.close()
      },
    })
    const stream = source.pipeThrough(new WireEventStream(() => {
      throw new Error('bad wire event')
    }))
    const reader = stream.getReader()

    await expect(reader.read()).resolves.toEqual({ done: false, value: { type: 'stream.start' } })
    await expect(reader.read()).rejects.toMatchObject({
      cause: expect.any(Error) as unknown,
      code: 'protocol-error',
      message: 'failed to normalize wire event',
    })
  })

  it('emits provider failures before the wire source closes', async () => {
    const error = new XSAIError('model-error', 'server exploded')
    const source = new ReadableStream<string>({
      start: (controller) => {
        controller.enqueue('{}')
      },
    })
    const stream = source.pipeThrough(new WireEventStream((_wire, builder) => {
      builder.fail(error)
    }))
    const reader = stream.getReader()

    await expect(reader.read()).resolves.toEqual({ done: false, value: { type: 'stream.start' } })
    await expect(reader.read()).resolves.toEqual({
      done: false,
      value: { error, message: { content: [], role: 'assistant' }, status: 'failed', type: 'stream.end' },
    })
    await expect(reader.read()).resolves.toEqual({ done: true, value: undefined })
  })
})
