import type { TextEvent } from '@xsai/text-primitives'

import { loop, maxSteps, tool } from '@xsai/text-primitives'
import { describe, expect, it, vi } from 'vitest'

import { messages } from '../src'

const sse = (events: unknown[]): Response => new Response(events.map(event => `data: ${JSON.stringify(event)}\n\n`).join(''))

const read = async (stream: ReadableStream<TextEvent>): Promise<TextEvent[]> => {
  const events: TextEvent[] = []
  for await (const event of stream)
    events.push(event)
  return events
}

const end = (reason: string) => [
  { delta: { stop_reason: reason }, type: 'message_delta', usage: { output_tokens: 1 } },
  { type: 'message_stop' },
]

describe('messages provider web search', () => {
  it('replays an unresolved server call beside a client call and sends only the client result', async () => {
    const executeSearch = vi.fn()
    const executeWeather = vi.fn(() => 'sunny')
    const requests: Record<string, unknown>[] = []
    const model = messages({
      baseURL: 'https://example.com/v1/',
      fetch: async (_input, init) => {
        requests.push(JSON.parse(init!.body as string) as Record<string, unknown>)
        return requests.length === 1
          ? sse([
              { message: { id: 'msg_1', usage: { input_tokens: 1, output_tokens: 0 } }, type: 'message_start' },
              { content_block: { caller: { type: 'direct' }, id: 'srv_1', input: { query: 'Taipei' }, name: 'web_search', type: 'server_tool_use' }, index: 0, type: 'content_block_start' },
              { index: 0, type: 'content_block_stop' },
              { content_block: { id: 'local_1', input: {}, name: 'weather', type: 'tool_use' }, index: 1, type: 'content_block_start' },
              { index: 1, type: 'content_block_stop' },
              ...end('tool_use'),
            ])
          : sse([{ message: { id: 'msg_2', usage: { input_tokens: 1, output_tokens: 0 } }, type: 'message_start' }, ...end('end_turn')])
      },
      model: 'test',
    })
    await read(loop(model, {
      input: 'weather?',
      maxOutputTokens: 100,
      tools: [
        tool({ execute: executeSearch, inputSchema: { type: 'object' }, name: 'web_search' }),
        tool({ execute: executeWeather, inputSchema: { type: 'object' }, name: 'weather' }),
      ],
    }))

    expect(executeSearch).not.toHaveBeenCalled()
    expect(executeWeather).toHaveBeenCalledOnce()
    expect((requests[1].messages as unknown[])).toEqual([
      { content: [{ text: 'weather?', type: 'text' }], role: 'user' },
      { content: [
        { id: 'srv_1', input: { query: 'Taipei' }, name: 'web_search', type: 'server_tool_use' },
        { id: 'local_1', input: {}, name: 'weather', type: 'tool_use' },
      ], role: 'assistant' },
      { content: [{ content: 'sunny', tool_use_id: 'local_1', type: 'tool_result' }], role: 'user' },
    ])
  })

  it('keeps call, result, citations and encrypted replay in assistant order', async () => {
    const citation = { cited_text: 'Sunny', encrypted_index: 'secret-index', title: 'Forecast', type: 'web_search_result_location', url: 'https://example.com' }
    const result = [{ encrypted_content: 'secret-content', page_age: null, title: 'Forecast', type: 'web_search_result', url: 'https://example.com' }]
    const requests: Record<string, unknown>[] = []
    const model = messages({
      baseURL: 'https://example.com/v1/',
      fetch: async (_input, init) => {
        requests.push(JSON.parse(init!.body as string) as Record<string, unknown>)
        return requests.length === 1
          ? sse([
              { message: { id: 'msg_1', usage: { input_tokens: 1, output_tokens: 0 } }, type: 'message_start' },
              { content_block: { caller: { type: 'direct' }, id: 'srv_1', input: {}, name: 'web_search', type: 'server_tool_use' }, index: 0, type: 'content_block_start' },
              { delta: { partial_json: '{"query":"Taipei"}', type: 'input_json_delta' }, index: 0, type: 'content_block_delta' },
              { index: 0, type: 'content_block_stop' },
              { content_block: { caller: { type: 'direct' }, content: result, tool_use_id: 'srv_1', type: 'web_search_tool_result' }, index: 1, type: 'content_block_start' },
              { index: 1, type: 'content_block_stop' },
              { content_block: { text: '', type: 'text' }, index: 2, type: 'content_block_start' },
              { delta: { text: 'Sunny', type: 'text_delta' }, index: 2, type: 'content_block_delta' },
              { delta: { citation, type: 'citations_delta' }, index: 2, type: 'content_block_delta' },
              { index: 2, type: 'content_block_stop' },
              ...end('end_turn'),
            ])
          : sse([
              { message: { id: 'msg_2', usage: { input_tokens: 1, output_tokens: 0 } }, type: 'message_start' },
              ...end('end_turn'),
            ])
      },
      model: 'test',
    })

    const events = await read(await model({ input: 'weather?', maxOutputTokens: 100 }))
    const content = events.filter(event => event.type === 'content.end').map(event => event.content)
    expect(content).toEqual([
      { arguments: '{"query":"Taipei"}', callId: 'srv_1', id: 'srv_1', name: 'web_search', providerExecuted: true, type: 'tool-call' },
      { callId: 'srv_1', output: JSON.stringify(result), providerExecuted: true, type: 'tool-result' },
      { providerMetadata: { messages: { citations: [citation] } }, text: 'Sunny', type: 'text' },
    ])
    expect(events.filter(event => event.type === 'content.start').map(event => event.contentType)).toEqual(['tool-call', 'tool-result', 'text'])
    const first = events.find(event => event.type === 'step.end') as Extract<TextEvent, { type: 'step.end' }>
    expect(first.message.content).toEqual(content)
    await read(await model({ input: [{ content: 'weather?', role: 'user' }, first.message], maxOutputTokens: 100 }))
    expect((requests[1].messages as unknown[])[1]).toEqual({
      content: [
        { id: 'srv_1', input: { query: 'Taipei' }, name: 'web_search', type: 'server_tool_use' },
        { content: result, tool_use_id: 'srv_1', type: 'web_search_tool_result' },
        { citations: [citation], text: 'Sunny', type: 'text' },
      ],
      role: 'assistant',
    })
  })

  it('continues repeated pause_turn with the same tool declaration', async () => {
    const requests: Record<string, unknown>[] = []
    const model = messages({
      baseURL: 'https://example.com/v1/',
      fetch: async (_input, init) => {
        requests.push(JSON.parse(init!.body as string) as Record<string, unknown>)
        return sse([
          { message: { id: `msg_${requests.length}`, usage: { input_tokens: 1, output_tokens: 0 } }, type: 'message_start' },
          ...end('pause_turn'),
        ])
      },
      model: 'test',
    })
    await read(loop(model, {
      input: 'search',
      maxOutputTokens: 100,
      providerOptions: { messages: { tools: [{ name: 'web_search', type: 'web_search_20250305' }] } },
      stopWhen: maxSteps(3),
    }))
    expect(requests).toHaveLength(3)
    expect(requests.map(request => request.tools)).toEqual([requests[0].tools, requests[0].tools, requests[0].tools])
    expect((requests[2].messages as unknown[])).toHaveLength(3)
  })
})
