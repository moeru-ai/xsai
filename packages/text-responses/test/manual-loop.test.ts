import type { Message, TextEvent } from '@xsai/text-primitives'

import { collect, HttpError } from '@xsai/text-primitives'
import { describe, expect, it } from 'vitest'

import { responses } from '../src'

const sseResponse = (events: unknown[]): Response => new Response([
  ...events.map(event => `data: ${JSON.stringify(event)}\n\n`),
  'data: [DONE]\n\n',
].join(''))

describe('manual tool loop', () => {
  it('skips foreign provider parts and replays file search with its citation', async () => {
    const requests: Record<string, unknown>[] = []
    const fileSearch = {
      id: 'fs_67c09ccea8c48191ade9367e3ba71515',
      queries: ['What is deep research?'],
      results: [{ file_id: 'file_1', filename: 'research.pdf', score: 0.92, text: 'Deep research combines sources.' }],
      status: 'completed',
      type: 'file_search_call',
    }
    const citation = { file_id: 'file_1', filename: 'research.pdf', index: 20, type: 'file_citation' }
    const answer = { content: [{ annotations: [citation], text: 'Deep research cites research.pdf.', type: 'output_text' }], id: 'msg_1', role: 'assistant', status: 'completed', type: 'message' }
    const foreignUse = { id: 'srvtoolu_01ABC123', input: { query: 'xsai' }, name: 'web_search', type: 'server_tool_use' }
    const model = responses({
      baseURL: 'https://example.com/v1/',
      fetch: async (_input, init) => {
        requests.push(JSON.parse(init!.body as string) as Record<string, unknown>)
        return sseResponse([{ response: { output: requests.length === 1 ? [fileSearch, answer] : [], status: 'completed' }, type: 'response.completed' }])
      },
      model: 'm',
    })
    const first = await model({ input: 'find', providerOptions: { responses: { include: ['file_search_call.results'] } } })
    let step: Extract<TextEvent, { type: 'step.end' }> | undefined
    for await (const event of first) {
      if (event.type === 'step.end')
        step = event
    }
    expect(step?.message.content).toEqual([
      { key: 'responses', type: 'provider', value: fileSearch },
      { providerMetadata: { responses: { citations: [citation] } }, text: 'Deep research cites research.pdf.', type: 'text' },
    ])
    expect(requests[0].include).toEqual(['file_search_call.results'])

    await collect(await model({ input: [
      { content: [{ key: 'messages', type: 'provider', value: foreignUse }], role: 'assistant' },
      { content: [{ text: 'a', type: 'text' }, { key: 'messages', type: 'provider', value: foreignUse }, { text: 'b', type: 'text' }], role: 'assistant' },
      step!.message,
      { content: 'more', role: 'user' },
    ] }))
    expect(requests[1].input).toEqual([
      { content: [{ text: 'a', type: 'output_text' }, { text: 'b', type: 'output_text' }], role: 'assistant', type: 'message' },
      fileSearch,
      { content: answer.content, id: answer.id, role: 'assistant', type: 'message' },
      { content: 'more', role: 'user', type: 'message' },
    ])
  })

  it('streams and replays web search output with citations and sources', async () => {
    const requests: Record<string, unknown>[] = []
    const citation = { end_index: 5, start_index: 0, title: 'Source', type: 'url_citation', url: 'https://example.com' }
    const search = { action: { queries: ['xsai'], sources: [{ type: 'url', url: 'https://example.com' }], type: 'search' }, id: 'ws_1', status: 'completed', type: 'web_search_call' }
    const answer = { content: [{ annotations: [citation], text: 'Found', type: 'output_text' }], id: 'msg_1', role: 'assistant', status: 'completed', type: 'message' }
    const model = responses({
      baseURL: 'https://example.com/v1/',
      fetch: async (_input, init) => {
        requests.push(JSON.parse(init!.body as string) as Record<string, unknown>)
        return requests.length === 1
          ? sseResponse([
              { item: { id: 'ws_1', status: 'in_progress', type: 'web_search_call' }, output_index: 0, type: 'response.output_item.added' },
              { item: search, output_index: 0, type: 'response.output_item.done' },
              { content_index: 0, output_index: 1, part: answer.content[0], type: 'response.content_part.done' },
              { response: { output: [search, answer], status: 'completed' }, type: 'response.completed' },
            ])
          : sseResponse([{ response: { output: [], status: 'completed' }, type: 'response.completed' }])
      },
      model: 'm',
    })
    const events: TextEvent[] = []
    for await (const event of await model({
      input: 'search',
      providerOptions: { responses: { include: ['web_search_call.action.sources'] } },
    }))
      events.push(event)

    const content = [
      { key: 'responses', type: 'provider', value: search },
      { providerMetadata: { responses: { citations: [citation] } }, text: 'Found', type: 'text' },
    ]
    expect(events.filter(event => event.type === 'content.start')).toEqual([
      { contentType: 'provider', index: 0, type: 'content.start' },
      { contentType: 'text', index: 1, type: 'content.start' },
    ])
    expect(events.filter(event => event.type === 'content.end')).toEqual([
      { content: content[0], index: 0, type: 'content.end' },
      { content: content[1], index: 1, type: 'content.end' },
    ])
    const step = events.find(event => event.type === 'step.end')!
    expect(step.message.content).toEqual(content)
    expect(requests[0].include).toEqual(['web_search_call.action.sources'])

    await collect(await model({ input: [step.message, { content: 'more', role: 'user' }] }))
    expect(requests[1].input).toEqual([
      search,
      { content: [{ annotations: [citation], text: 'Found', type: 'output_text' }], id: 'msg_1', role: 'assistant', type: 'message' },
      { content: 'more', role: 'user', type: 'message' },
    ])
    expect(search.action.sources).toEqual([{ type: 'url', url: 'https://example.com' }])
  })

  it('replays a normalized tool call and tool result in the next request', async () => {
    const requests: Record<string, unknown>[] = []
    const responsesByTurn = [
      sseResponse([
        {
          item: {
            arguments: '',
            call_id: 'call_1',
            id: 'fc_1',
            name: 'weather',
            status: 'in_progress',
            type: 'function_call',
          },
          output_index: 0,
          type: 'response.output_item.added',
        },
        {
          delta: '{"location":"Taipei"}',
          item_id: 'fc_1',
          output_index: 0,
          type: 'response.function_call_arguments.delta',
        },
        {
          item: {
            arguments: '{"location":"Taipei"}',
            call_id: 'call_1',
            id: 'fc_1',
            name: 'weather',
            status: 'completed',
            type: 'function_call',
          },
          output_index: 0,
          type: 'response.output_item.done',
        },
        {
          response: {
            error: null,
            id: 'resp_1',
            incomplete_details: null,
            output: [{
              arguments: '{"location":"Taipei"}',
              call_id: 'call_1',
              id: 'fc_1',
              name: 'weather',
              status: 'completed',
              type: 'function_call',
            }],
            status: 'completed',
            usage: null,
          },
          type: 'response.completed',
        },
      ]),
      sseResponse([
        {
          response: {
            error: null,
            incomplete_details: null,
            output: [{
              content: [{ annotations: [], text: '24°C', type: 'output_text' }],
              id: 'message_2',
              role: 'assistant',
              status: 'completed',
              type: 'message',
            }],
            status: 'completed',
            usage: null,
          },
          type: 'response.completed',
        },
      ]),
    ]
    const model = responses({
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

    expect(stepEnd?.message.content).toEqual([{
      arguments: '{"location":"Taipei"}',
      callId: 'call_1',
      id: 'fc_1',
      name: 'weather',
      type: 'tool-call',
    }])

    input.push(stepEnd!.message)
    input.push({
      content: [{ callId: 'call_1', output: '24°C', type: 'tool-result' }],
      role: 'user',
    })

    for await (const event of await model({ input })) {
      if (event.type === 'step.end')
        expect(event.message.content).toEqual([{ text: '24°C', type: 'text' }])
    }

    expect(requests[1].input).toEqual([
      { content: 'What is the weather?', role: 'user', type: 'message' },
      {
        arguments: '{"location":"Taipei"}',
        call_id: 'call_1',
        id: 'fc_1',
        name: 'weather',
        type: 'function_call',
      },
      {
        call_id: 'call_1',
        output: '24°C',
        type: 'function_call_output',
      },
    ])
  })

  it('rejects with the response body on non-2xx', async () => {
    const model = responses({
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
})
