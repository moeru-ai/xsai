import type { Event } from '../src'

import { describe, expect, it } from 'vitest'

import { partAssembler } from '../src'
import { XSAIError } from '../src/shared'

describe('partAssembler', () => {
  it('preserves an empty reasoning part when no delta arrives', () => {
    const events: Event[] = []
    const assembler = partAssembler(event => events.push(event))

    assembler.start('reasoning', 'reasoning')
    assembler.finish('stop')
    assembler.flush()

    const reasoning = { content: [{ text: '', type: 'text' }], type: 'reasoning' }
    expect(events).toEqual([
      { contentType: 'reasoning', index: 0, type: 'content.start' },
      { content: reasoning, index: 0, type: 'content.end' },
      { message: { content: [reasoning], role: 'assistant' }, reason: 'stop', type: 'finish' },
    ])
  })

  it('carries the terminating error on the finish event', () => {
    const events: Event[] = []
    const assembler = partAssembler(event => events.push(event))
    const error = new XSAIError('model-error', 'server exploded', { cause: { type: 'server_error' } })

    assembler.finish('error', { error })
    assembler.flush()

    expect(events).toEqual([
      { error, message: { content: [], role: 'assistant' }, reason: 'error', type: 'finish' },
    ])
  })

  it('keeps the first finish: a later finish cannot replace the recorded error', () => {
    const events: Event[] = []
    const assembler = partAssembler(event => events.push(event))
    const error = new XSAIError('model-error', 'server exploded')

    assembler.finish('error', { error })
    assembler.finish('stop')
    assembler.flush()

    expect(events).toEqual([
      { error, message: { content: [], role: 'assistant' }, reason: 'error', type: 'finish' },
    ])
  })
})
