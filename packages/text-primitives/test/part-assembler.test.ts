import type { Event } from '../src'

import { describe, expect, it } from 'vitest'

import { partAssembler } from '../src'

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
})
