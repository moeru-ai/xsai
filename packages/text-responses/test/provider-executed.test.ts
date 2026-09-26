import type { TextEvent } from '@xsai/text-primitives'

import { collect, loop, tool } from '@xsai/text-primitives'
import { describe, expect, it, vi } from 'vitest'

import { responses } from '../src'

const sse = (events: unknown[]): Response => new Response([
  ...events.map(event => `data: ${JSON.stringify(event)}\n\n`),
  'data: [DONE]\n\n',
].join(''))

const terminal = (output: unknown[]) => ({
  response: { error: null, incomplete_details: null, output, status: 'completed', usage: null },
  type: 'response.completed',
})

const read = async (stream: ReadableStream<TextEvent>): Promise<TextEvent[]> => {
  const events: TextEvent[] = []
  for await (const event of stream)
    events.push(event)
  return events
}

describe('provider-executed web search on Responses', () => {
  it('emits completed parts when only the terminal response carries a web search item', async () => {
    const item = { action: { type: 'open_page', url: 'https://example.com' }, id: 'ws_3', status: 'completed', type: 'web_search_call' }
    const model = responses({
      baseURL: 'https://example.com/v1/',
      fetch: async () => sse([terminal([item, { content: [{ annotations: [], text: 'Found it', type: 'output_text' }], id: 'msg_3', role: 'assistant', type: 'message' }])]),
      model: 'test',
    })
    const events = await read(await model({ input: 'search' }))
    const ends = events.filter(event => event.type === 'content.end')
    expect(ends.map(event => event.index)).toEqual([0, 1, 2])
    expect(ends.map(event => event.content)).toEqual((events.find(event => event.type === 'step.end') as Extract<TextEvent, { type: 'step.end' }>).message.content)
  })

  it('emits ordered call and returned action, then replays only input fields', async () => {
    const action = { queries: ['Taipei weather'], query: null, sources: [{ type: 'url', url: 'https://example.com' }], type: 'search' }
    const annotation = { end_index: 5, start_index: 0, title: 'Forecast', type: 'url_citation', url: 'https://example.com' }
    const item = { action, id: 'ws_1', status: 'completed', type: 'web_search_call' }
    const requests: Record<string, unknown>[] = []
    const model = responses({
      apiKey: 'test',
      baseURL: 'https://example.com/v1/',
      fetch: async (_input, init) => {
        requests.push(JSON.parse(init!.body as string) as Record<string, unknown>)
        return requests.length === 1
          ? sse([
              { item: { id: 'ws_1', status: 'in_progress', type: 'web_search_call' }, output_index: 0, type: 'response.output_item.added' },
              { item, output_index: 0, type: 'response.output_item.done' },
              terminal([item, { content: [{ annotations: [annotation], text: 'sunny', type: 'output_text' }], id: 'msg_1', role: 'assistant', type: 'message' }]),
            ])
          : sse([terminal([{ content: [{ text: 'done', type: 'output_text' }], id: 'msg_2', role: 'assistant', type: 'message' }])])
      },
      model: 'test',
    })

    const events = await read(await model({
      input: 'weather?',
      providerOptions: { responses: { include: ['web_search_call.action.sources', 'provider.future_field'] } },
    }))
    const content = events.filter(event => event.type === 'content.end').map(event => event.content)
    expect(content).toEqual([
      { arguments: '{}', callId: 'ws_1', id: 'ws_1', name: 'web_search', providerExecuted: true, type: 'tool-call' },
      { callId: 'ws_1', output: JSON.stringify(action), providerExecuted: true, type: 'tool-result' },
      { providerMetadata: { responses: { annotations: [annotation] } }, text: 'sunny', type: 'text' },
    ])
    expect(events.filter(event => event.type === 'content.start').map(event => event.contentType)).toEqual(['tool-call', 'tool-result', 'text'])
    expect((events.find(event => event.type === 'step.end') as Extract<TextEvent, { type: 'step.end' }>).message.content).toEqual(content)
    expect(requests[0].include).toEqual(['web_search_call.action.sources', 'provider.future_field'])
    const first = events.find(event => event.type === 'step.end') as Extract<TextEvent, { type: 'step.end' }>
    await read(await model({ input: [{ content: 'weather?', role: 'user' }, first.message] }))
    expect(requests[1].input).toEqual([
      { content: 'weather?', role: 'user', type: 'message' },
      { action: { queries: ['Taipei weather'], type: 'search' }, id: 'ws_1', status: 'completed', type: 'web_search_call' },
      { content: [{ annotations: [annotation], text: 'sunny', type: 'output_text' }], id: 'msg_1', role: 'assistant', type: 'message' },
    ])
  })

  it('keeps action-less calls observable without fabricating a result or replay item', async () => {
    const item = { id: 'ws_2', status: 'completed', type: 'web_search_call' }
    const execute = vi.fn()
    const requests: Record<string, unknown>[] = []
    const model = responses({
      baseURL: 'https://example.com/v1/',
      fetch: async (_input, init) => {
        requests.push(JSON.parse(init!.body as string) as Record<string, unknown>)
        return requests.length === 1 || requests.length === 3
          ? sse([{ item, output_index: 0, type: 'response.output_item.done' }, terminal([item])])
          : sse([terminal([])])
      },
      model: 'test',
    })
    const step = await collect(model, { input: 'search' })
    expect(step.toolCalls).toEqual([{ arguments: '{}', callId: 'ws_2', id: 'ws_2', name: 'web_search', providerExecuted: true, type: 'tool-call' }])
    expect(step.toolResults).toEqual([])
    await read(await model({ input: [{ content: 'search', role: 'user' }, step.message] }))
    expect(requests[1].input).toEqual([{ content: 'search', role: 'user', type: 'message' }])
    await read(loop(model, { input: 'search', stopWhen: () => false, tools: [tool({ execute, inputSchema: { type: 'object' }, name: 'web_search' })] }))
    expect(execute).not.toHaveBeenCalled()
  })
})
