import type { Event } from '../src'

import { describe, expect, it } from 'vitest'

import { partAssembler } from '../src'
import { XSAIError } from '../src/shared'

describe('partAssembler', () => {
  it('preserves an empty reasoning part when no delta arrives', () => {
    const events: Event[] = []
    const failures: XSAIError[] = []
    const assembler = partAssembler(event => events.push(event), error => failures.push(error))

    assembler.start('reasoning', 'reasoning')
    assembler.finish('stop')
    assembler.flush()

    const reasoning = { content: [{ text: '', type: 'text' }], type: 'reasoning' }
    expect(events).toEqual([
      { contentType: 'reasoning', index: 0, type: 'content.start' },
      { content: reasoning, index: 0, type: 'content.end' },
      { message: { content: [reasoning], role: 'assistant' }, reason: 'stop', type: 'finish' },
    ])
    expect(failures).toEqual([])
  })

  it('carries response-level identity on the finish event', () => {
    const events: Event[] = []
    const assembler = partAssembler(event => events.push(event), () => {})

    assembler.meta({ messageId: 'msg_1', responseId: 'resp_1', responseStatus: 'completed' })
    assembler.finish('stop')
    assembler.flush()

    expect(events).toEqual([
      {
        message: { content: [], id: 'msg_1', role: 'assistant' },
        reason: 'stop',
        responseId: 'resp_1',
        responseStatus: 'completed',
        type: 'finish',
      },
    ])
  })

  it('backfills a streamed message id onto an override message without one', () => {
    const events: Event[] = []
    const assembler = partAssembler(event => events.push(event), () => {})

    assembler.meta({ messageId: 'msg_1' })
    assembler.finish('stop', { message: { content: [{ text: 'Hi', type: 'text' }], role: 'assistant' } })
    assembler.flush()

    expect(events).toEqual([
      {
        message: { content: [{ text: 'Hi', type: 'text' }], id: 'msg_1', role: 'assistant' },
        reason: 'stop',
        type: 'finish',
      },
    ])
  })

  it('prefers the override message id over a streamed one', () => {
    const events: Event[] = []
    const assembler = partAssembler(event => events.push(event), () => {})

    assembler.meta({ messageId: 'msg_streamed' })
    assembler.finish('stop', {
      message: { content: [], id: 'msg_terminal', role: 'assistant' },
    })
    assembler.flush()

    expect(events).toEqual([
      {
        message: { content: [], id: 'msg_terminal', role: 'assistant' },
        reason: 'stop',
        type: 'finish',
      },
    ])
  })

  it('carries the terminating error on the finish event', () => {
    const events: Event[] = []
    const assembler = partAssembler(event => events.push(event), () => {})
    const error = new XSAIError('model-error', 'server exploded', { cause: { type: 'server_error' } })

    assembler.finish('error', { error })
    assembler.flush()

    expect(events).toEqual([
      { error, message: { content: [], role: 'assistant' }, reason: 'error', type: 'finish' },
    ])
  })

  it('keeps the first finish: a later finish cannot replace the recorded error', () => {
    const events: Event[] = []
    const assembler = partAssembler(event => events.push(event), () => {})
    const error = new XSAIError('model-error', 'server exploded')

    assembler.finish('error', { error })
    assembler.finish('stop')
    assembler.flush()

    expect(events).toEqual([
      { error, message: { content: [], role: 'assistant' }, reason: 'error', type: 'finish' },
    ])
  })

  it('fails the stream when the wire ends without a terminal signal', () => {
    const events: Event[] = []
    const failures: XSAIError[] = []
    const assembler = partAssembler(event => events.push(event), error => failures.push(error))

    assembler.start('text', 'text')
    assembler.delta('text', 'Hi')
    assembler.flush()

    expect(failures).toHaveLength(1)
    expect(failures[0]).toMatchObject({ code: 'truncated-stream' })
    expect(events).toEqual([
      { contentType: 'text', index: 0, type: 'content.start' },
      { delta: 'Hi', index: 0, type: 'text.delta' },
    ])
  })
})
