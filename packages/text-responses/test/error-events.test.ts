import type { StepEndEvent, TextEvent } from '@xsai/text'

import { XSAIError } from '@xsai/text'
import { describe, expect, it } from 'vitest'

import { responses } from '../src'

describe('responses error events', () => {
  it.each(['OpenAI', 'OpenResponses'])('preserves partial output and raw events for %s errors', async (shape) => {
    const error = { code: 'invalid_request', message: 'invalid input', param: 'input' }
    const payload = shape === 'OpenResponses' ? { ...error, type: 'invalid_request_error' } : error
    const wireError = {
      ...(shape === 'OpenResponses' ? { error: payload } : payload),
      sequence_number: 2,
      type: 'error',
    }
    const wireEvents = [
      { content_index: 0, delta: 'Hello', output_index: 0, sequence_number: 1, type: 'response.output_text.delta' },
      wireError,
      { response: { output: [], status: 'completed' }, sequence_number: 3, type: 'response.completed' },
    ]
    const model = responses({
      baseURL: 'https://example.com/v1/',
      fetch: async () => new Response([
        ...wireEvents.map(event => `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`),
        'data: [DONE]\n\n',
      ].join('')),
      model: 'test-model',
    })
    const events: TextEvent[] = []
    for await (const event of await model({ includeRawEvents: true, input: 'hi' }))
      events.push(event)

    expect(events.filter(event => event.type === 'raw').map(event => event.detail)).toEqual(wireEvents.slice(0, 2))
    expect(events.filter(event => event.type === 'step.end')).toEqual([
      {
        error: expect.any(XSAIError) as unknown,
        message: { content: [{ text: 'Hello', type: 'text' }], role: 'assistant' },
        status: 'failed',
        type: 'step.end',
      },
    ])
    expect((events.at(-1) as StepEndEvent).error).toMatchObject({
      cause: payload,
      code: 'model-error',
      message: error.message,
    })
    expect((events.at(-1) as StepEndEvent).error?.cause).toEqual(shape === 'OpenResponses' ? payload : wireError)
  })
})
