import type { Message, TextEvent } from '@xsai/text'

import { HttpError, TextEventTarget, XSAIError } from '@xsai/text'
import { describe, expect, it } from 'vitest'

import { chat } from '../src'

const sseResponse = (events: unknown[]): Response => new Response([
  ...events.map(event => `data: ${JSON.stringify(event)}\n\n`),
  'data: [DONE]\n\n',
].join(''))

describe('manual tool loop', () => {
  it.each([
    { create: () => new TextEventTarget(), name: 'typed' },
    { create: () => new EventTarget(), name: 'native' },
    { create: () => new EventTarget() as TextEventTarget, name: 'cast' },
  ])('observes bare model events with a $name target', async ({ create }) => {
    const events = create()
    const observed: Event[] = []
    for (const type of ['step.start', 'raw', 'content.start', 'text.delta', 'content.end', 'step.end'] as const)
      events.addEventListener(type, (event: Event) => observed.push(event))
    const model = chat({
      baseURL: 'https://example.com/v1/',
      fetch: async () => sseResponse([
        { choices: [{ delta: { content: 'Hello' }, finish_reason: 'stop', index: 0 }] },
      ]),
      model: 'test-model',
    })

    const stream = await model({ events, includeRawEvents: true, input: 'hi' })
    expect(stream.locked).toBe(false)
    expect(observed.map(event => event.type)).toEqual(['step.start'])
    const sequence: TextEvent[] = []
    for await (const event of stream)
      sequence.push(event)

    expect(observed.map(event => event.type)).toEqual([
      'step.start',
      'raw',
      'content.start',
      'text.delta',
      'content.end',
      'step.end',
    ])
    expect(observed.every(event => event instanceof CustomEvent)).toBe(true)
    expect((observed.find(event => event.type === 'text.delta') as CustomEvent).detail).toEqual({ delta: 'Hello', index: 0 })
    expect((observed.find(event => event.type === 'raw') as CustomEvent).detail).toBe(sequence.find(event => event.type === 'raw')?.detail)
  })

  it('replays the finish message and tool result in the next request', async () => {
    const requests: Record<string, unknown>[] = []
    const responsesByTurn = [
      sseResponse([
        {
          choices: [{
            delta: {
              tool_calls: [{
                function: { arguments: '{"location":"Taipei"}', name: 'weather' },
                id: 'call_1',
                index: 0,
                type: 'function',
              }],
            },
            finish_reason: null,
            index: 0,
          }],
          id: 'chatcmpl_1',
        },
        {
          choices: [{ delta: {}, finish_reason: 'tool_calls', index: 0 }],
          id: 'chatcmpl_1',
        },
        {
          choices: [],
          id: 'chatcmpl_1',
          usage: { completion_tokens: 10, prompt_tokens: 20, total_tokens: 30 },
        },
      ]),
      sseResponse([
        {
          choices: [{ delta: { content: '24°C', role: 'assistant' }, finish_reason: null, index: 0 }],
          id: 'chatcmpl_2',
        },
        {
          choices: [{ delta: {}, finish_reason: 'stop', index: 0 }],
          id: 'chatcmpl_2',
        },
        {
          choices: [],
          id: 'chatcmpl_2',
          usage: { completion_tokens: 5, prompt_tokens: 40, total_tokens: 45 },
        },
      ]),
    ]
    const model = chat({
      apiKey: 'test-key',
      baseURL: 'https://example.com/v1/',
      fetch: async (_input, init) => {
        requests.push(JSON.parse(init!.body as string) as Record<string, unknown>)
        return responsesByTurn[requests.length - 1]
      },
      model: 'test-model',
    })
    const input: Message[] = [{ content: 'What is the weather?', role: 'user' }]

    const firstStream = await model({ input })
    let stepEnd: Extract<TextEvent, { type: 'step.end' }> | undefined
    for await (const event of firstStream) {
      if (event.type === 'step.end')
        stepEnd = event
    }

    input.push(stepEnd!.message)
    input.push({
      content: [{ callId: 'call_1', output: '24°C', type: 'tool-result' }],
      role: 'user',
    })

    for await (const event of await model({ input })) {
      if (event.type === 'step.end')
        expect(event.message.content).toEqual([{ text: '24°C', type: 'text' }])
    }

    expect(requests[1].messages).toEqual([
      { content: 'What is the weather?', role: 'user' },
      {
        content: '',
        role: 'assistant',
        tool_calls: [{
          function: { arguments: '{"location":"Taipei"}', name: 'weather' },
          id: 'call_1',
          type: 'function',
        }],
      },
      { content: '24°C', role: 'tool', tool_call_id: 'call_1' },
    ])
    expect(requests[1].stream_options).toEqual({ include_usage: true })
  })

  it('rejects with the response body on non-2xx', async () => {
    const model = chat({
      apiKey: 'test-key',
      baseURL: 'https://example.com/v1/',
      fetch: async () => new Response('{"error":{"message":"bad key"}}', { status: 401 }),
      model: 'test-model',
    })

    await expect(model({ input: 'hi' })).rejects.toThrow(HttpError)
    await expect(model({ input: 'hi' })).rejects.toMatchObject({
      body: '{"error":{"message":"bad key"}}',
      code: 'http-error',
      status: 401,
    })
  })

  it('rejects with an invalid-response error on an empty 2xx body', async () => {
    const model = chat({
      apiKey: 'test-key',
      baseURL: 'https://example.com/v1/',
      fetch: async () => new Response(null, { status: 200 }),
      model: 'test-model',
    })

    await expect(model({ input: 'hi' })).rejects.toThrow(XSAIError)
    await expect(model({ input: 'hi' })).rejects.toMatchObject({
      code: 'invalid-response',
      message: 'Response body is empty',
    })
  })
})
