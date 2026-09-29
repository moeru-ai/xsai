import type { TextEvent } from '@xsai/text-primitives'

import { collect } from '@xsai/text-primitives'
import { describe, expect, it } from 'vitest'

import { messages } from '../src'

const sseResponse = (events: unknown[]): Response => new Response(events.map(event => `data: ${JSON.stringify(event)}\n\n`).join(''))

describe('messages provider tools', () => {
  it('replays a web fetch result and skips foreign provider-only assistant messages', async () => {
    const requests: Record<string, unknown>[] = []
    const fetchUse = { id: 'srvtoolu_01234567890abcdef', input: { url: 'https://example.com/article' }, name: 'web_fetch', type: 'server_tool_use' }
    const fetchResult = {
      content: {
        content: { source: { data: 'Full text content of the article...', media_type: 'text/plain', type: 'text' }, title: 'Article Title', type: 'document' },
        retrieved_at: '2025-08-25T10:30:02Z',
        type: 'web_fetch_result',
        url: 'https://example.com/article',
      },
      tool_use_id: fetchUse.id,
      type: 'web_fetch_tool_result',
    }
    const model = messages({
      baseURL: 'https://example.com/v1/',
      fetch: async (_input, init) => {
        requests.push(JSON.parse(init!.body as string) as Record<string, unknown>)
        return requests.length === 1
          ? sseResponse([
              { message: { id: 'msg_1', usage: {} }, type: 'message_start' },
              { content_block: { ...fetchUse, input: {} }, index: 0, type: 'content_block_start' },
              { delta: { partial_json: '{"url":"https://example.com/article"}', type: 'input_json_delta' }, index: 0, type: 'content_block_delta' },
              { index: 0, type: 'content_block_stop' },
              { content_block: fetchResult, index: 1, type: 'content_block_start' },
              { index: 1, type: 'content_block_stop' },
              { delta: { stop_reason: 'end_turn' }, type: 'message_delta' },
              { type: 'message_stop' },
            ])
          : sseResponse([{ message: { id: 'msg_2', usage: {} }, type: 'message_start' }, { delta: { stop_reason: 'end_turn' }, type: 'message_delta' }, { type: 'message_stop' }])
      },
      model: 'm',
    })
    let step: Extract<TextEvent, { type: 'step.end' }> | undefined
    for await (const event of await model({ input: 'Fetch https://example.com/article', maxOutputTokens: 100 })) {
      if (event.type === 'step.end')
        step = event
    }
    expect(step?.message.content).toEqual([
      { key: 'messages', type: 'provider', value: fetchUse },
      { key: 'messages', type: 'provider', value: fetchResult },
    ])

    await collect(await model({ input: [
      { content: [{ key: 'responses', type: 'provider', value: { action: { queries: ['xsai'], type: 'search' }, id: 'ws_1', status: 'completed', type: 'web_search_call' } }], role: 'assistant' },
      step!.message,
      { content: 'more', role: 'user' },
    ], maxOutputTokens: 100 }))
    expect(requests[1].messages).toEqual([
      { content: [fetchUse, fetchResult], role: 'assistant' },
      { content: [{ text: 'more', type: 'text' }], role: 'user' },
    ])
  })

  it('streams and replays a web search call, encrypted result, and cited text', async () => {
    const requests: Record<string, unknown>[] = []
    const citation = { cited_text: 'Result', encrypted_index: 'enc_1', title: 'Source', type: 'web_search_result_location', url: 'https://example.com' }
    const searchResult = { content: [{ encrypted_content: 'secret', title: 'Source', type: 'web_search_result', url: 'https://example.com' }], tool_use_id: 'srvtoolu_01ABC123', type: 'web_search_tool_result' }
    const model = messages({
      baseURL: 'https://example.com/v1/',
      fetch: async (_input, init) => {
        requests.push(JSON.parse(init!.body as string) as Record<string, unknown>)
        return requests.length === 1
          ? sseResponse([
              { message: { id: 'msg_1', usage: {} }, type: 'message_start' },
              { content_block: { id: 'srvtoolu_01ABC123', input: {}, name: 'web_search', type: 'server_tool_use' }, index: 0, type: 'content_block_start' },
              { delta: { partial_json: '{"query":"xsai"}', type: 'input_json_delta' }, index: 0, type: 'content_block_delta' },
              { index: 0, type: 'content_block_stop' },
              { content_block: searchResult, index: 1, type: 'content_block_start' },
              { index: 1, type: 'content_block_stop' },
              { content_block: { text: '', type: 'text' }, index: 2, type: 'content_block_start' },
              { delta: { text: 'Found', type: 'text_delta' }, index: 2, type: 'content_block_delta' },
              { delta: { citation, type: 'citations_delta' }, index: 2, type: 'content_block_delta' },
              { index: 2, type: 'content_block_stop' },
              { delta: { stop_reason: 'end_turn' }, type: 'message_delta' },
              { type: 'message_stop' },
            ])
          : sseResponse([{ message: { id: 'msg_2', usage: {} }, type: 'message_start' }, { delta: { stop_reason: 'end_turn' }, type: 'message_delta' }, { type: 'message_stop' }])
      },
      model: 'm',
    })
    const events: TextEvent[] = []
    for await (const event of await model({ input: 'search', maxOutputTokens: 100 }))
      events.push(event)

    const content = [
      { key: 'messages', type: 'provider', value: { id: 'srvtoolu_01ABC123', input: { query: 'xsai' }, name: 'web_search', type: 'server_tool_use' } },
      { key: 'messages', type: 'provider', value: searchResult },
      { providerMetadata: { messages: { citations: [citation] } }, text: 'Found', type: 'text' },
    ]
    expect(events.filter(event => event.type === 'content.start')).toEqual([
      { contentType: 'provider', index: 0, type: 'content.start' },
      { contentType: 'provider', index: 1, type: 'content.start' },
      { contentType: 'text', index: 2, type: 'content.start' },
    ])
    expect(events.filter(event => event.type === 'content.end')).toEqual(content.map((part, index) => ({ content: part, index, type: 'content.end' })))
    const step = events.find(event => event.type === 'step.end')!
    expect(step.message.content).toEqual(content)

    await collect(await model({ input: [step.message, { content: 'more', role: 'user' }], maxOutputTokens: 100 }))
    expect(requests[1].messages).toEqual([
      { content: [content[0].value, searchResult, { citations: [citation], text: 'Found', type: 'text' }], role: 'assistant' },
      { content: [{ text: 'more', type: 'text' }], role: 'user' },
    ])
  })
})
