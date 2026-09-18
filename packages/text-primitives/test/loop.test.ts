import type { Event, LanguageModel } from '../src'

import { describe, expect, it, vi } from 'vitest'

import { loop, tool } from '../src'

const eventStream = (event: Event): ReadableStream<Event> => new ReadableStream<Event>({
  start: (controller) => {
    controller.enqueue(event)
    controller.close()
  },
})

describe('loop', () => {
  it('passes the loop signal to the executable tool handler', async () => {
    const execute = vi.fn(() => 'sunny')
    const weather = tool({
      execute,
      inputSchema: { type: 'object' },
      name: 'get_weather',
    })
    const controller = new AbortController()
    let callCount = 0
    const model: LanguageModel = async () => {
      callCount++
      return eventStream(callCount === 1
        ? {
            message: {
              content: [{ arguments: '{"city":"Taipei"}', callId: 'call-1', id: 'tool-1', name: 'get_weather', type: 'tool-call' }],
              role: 'assistant',
            },
            reason: 'tool-calls',
            status: 'completed',
            type: 'stream.end',
          }
        : {
            message: { content: 'sunny', role: 'assistant' },
            reason: 'stop',
            status: 'completed',
            type: 'stream.end',
          })
    }

    await loop(model, {
      input: 'What is the weather in Taipei?',
      signal: controller.signal,
      stopWhen: () => false,
      tools: [weather],
    })

    expect(execute).toHaveBeenCalledWith({ city: 'Taipei' }, { signal: controller.signal })
  })
})
