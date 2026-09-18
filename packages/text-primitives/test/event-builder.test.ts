import type { Event } from '../src'

import { describe, expect, it } from 'vitest'

import { eventBuilder } from '../src'
import { XSAIError } from '../src/shared'

describe('eventBuilder', () => {
  it('preserves an empty reasoning part when no delta arrives', () => {
    const events: Event[] = []
    const failures: XSAIError[] = []
    const builder = eventBuilder(event => events.push(event), error => failures.push(error))

    builder.start('reasoning', 'reasoning')
    builder.finish('stop')
    builder.flush()

    const reasoning = { content: [{ text: '', type: 'text' }], type: 'reasoning' }
    expect(events).toEqual([
      { contentType: 'reasoning', index: 0, type: 'content.start' },
      { content: reasoning, index: 0, type: 'content.end' },
      { message: { content: [reasoning], role: 'assistant' }, reason: 'stop', type: 'stream.end' },
    ])
    expect(failures).toEqual([])
  })

  it('assembles refusal parts', () => {
    const events: Event[] = []
    const builder = eventBuilder(event => events.push(event), () => {})

    builder.start('refusal', 'refusal')
    builder.delta('refusal', 'I cannot')
    builder.delta('refusal', ' help')
    builder.end('refusal')
    builder.finish('stop')
    builder.flush()

    const refusal = { refusal: 'I cannot help', type: 'refusal' }
    expect(events).toEqual([
      { contentType: 'refusal', index: 0, type: 'content.start' },
      { delta: 'I cannot', index: 0, type: 'refusal.delta' },
      { delta: ' help', index: 0, type: 'refusal.delta' },
      { content: refusal, index: 0, type: 'content.end' },
      { message: { content: [refusal], role: 'assistant' }, reason: 'stop', type: 'stream.end' },
    ])
  })

  it('carries response-level identity on the stream.end event', () => {
    const events: Event[] = []
    const builder = eventBuilder(event => events.push(event), () => {})

    builder.meta({ messageId: 'msg_1', responseId: 'resp_1', responseStatus: 'completed' })
    builder.finish('stop')
    builder.flush()

    expect(events).toEqual([
      {
        message: { content: [], id: 'msg_1', role: 'assistant' },
        reason: 'stop',
        responseId: 'resp_1',
        responseStatus: 'completed',
        type: 'stream.end',
      },
    ])
  })

  it('backfills a streamed message id onto an override message without one', () => {
    const events: Event[] = []
    const builder = eventBuilder(event => events.push(event), () => {})

    builder.meta({ messageId: 'msg_1' })
    builder.finish('stop', { message: { content: [{ text: 'Hi', type: 'text' }], role: 'assistant' } })
    builder.flush()

    expect(events).toEqual([
      {
        message: { content: [{ text: 'Hi', type: 'text' }], id: 'msg_1', role: 'assistant' },
        reason: 'stop',
        type: 'stream.end',
      },
    ])
  })

  it('prefers the override message id over a streamed one', () => {
    const events: Event[] = []
    const builder = eventBuilder(event => events.push(event), () => {})

    builder.meta({ messageId: 'msg_streamed' })
    builder.finish('stop', {
      message: { content: [], id: 'msg_terminal', role: 'assistant' },
    })
    builder.flush()

    expect(events).toEqual([
      {
        message: { content: [], id: 'msg_terminal', role: 'assistant' },
        reason: 'stop',
        type: 'stream.end',
      },
    ])
  })

  it('carries the terminating error on the stream.end event', () => {
    const events: Event[] = []
    const builder = eventBuilder(event => events.push(event), () => {})
    const error = new XSAIError('model-error', 'server exploded', { cause: { type: 'server_error' } })

    builder.finish('error', { error })
    builder.flush()

    expect(events).toEqual([
      { error, message: { content: [], role: 'assistant' }, reason: 'error', type: 'stream.end' },
    ])
  })

  it('keeps the first terminal reason: a later finish cannot replace the recorded error', () => {
    const events: Event[] = []
    const builder = eventBuilder(event => events.push(event), () => {})
    const error = new XSAIError('model-error', 'server exploded')

    builder.finish('error', { error })
    builder.finish('stop')
    builder.flush()

    expect(events).toEqual([
      { error, message: { content: [], role: 'assistant' }, reason: 'error', type: 'stream.end' },
    ])
  })

  it('fails the stream when the wire ends without a terminal signal', () => {
    const events: Event[] = []
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
})
