import type { Event, EventSourceMessage, FinishEvent } from '@xsai/text-primitives'

import { EventSourceDataStream } from '@xsai/text-primitives'
import { XSAIError } from '@xsai/text-primitives/shared'
import { describe, expect, it } from 'vitest'

import { ChatEventStream } from '../src/utils/chat-event-stream'

const readEvents = async (messages: EventSourceMessage[]): Promise<Event[]> => {
  const source = new ReadableStream<EventSourceMessage>({
    start: (controller) => {
      for (const message of messages)
        controller.enqueue(message)

      controller.close()
    },
  })
  const stream = source
    .pipeThrough(new EventSourceDataStream())
    .pipeThrough(new ChatEventStream())
  const reader = stream.getReader()
  const events: Event[] = []

  while (true) {
    const result = await reader.read()
    if (result.done)
      return events

    events.push(result.value)
  }
}

const message = (data: unknown): EventSourceMessage => ({ data: JSON.stringify(data) })

describe('chat event stream', () => {
  it('maps a text turn to primitive events', async () => {
    await expect(readEvents([
      message({
        choices: [{ delta: { role: 'assistant' }, finish_reason: null, index: 0 }],
        id: 'chatcmpl_1',
      }),
      message({
        choices: [{ delta: { content: 'Hello' }, finish_reason: null, index: 0 }],
        id: 'chatcmpl_1',
      }),
      message({
        choices: [{ delta: { content: ' world' }, finish_reason: null, index: 0 }],
        id: 'chatcmpl_1',
      }),
      message({
        choices: [{ delta: {}, finish_reason: 'stop', index: 0 }],
        id: 'chatcmpl_1',
      }),
      message({
        choices: [],
        id: 'chatcmpl_1',
        usage: { completion_tokens: 20, prompt_tokens: 10, total_tokens: 30 },
      }),
      { data: '[DONE]' },
    ])).resolves.toEqual([
      { contentType: 'text', index: 0, type: 'content.start' },
      { delta: 'Hello', index: 0, type: 'text.delta' },
      { delta: ' world', index: 0, type: 'text.delta' },
      { content: { text: 'Hello world', type: 'text' }, index: 0, type: 'content.end' },
      {
        message: {
          content: [{ text: 'Hello world', type: 'text' }],
          role: 'assistant',
        },
        reason: 'stop',
        responseId: 'chatcmpl_1',
        type: 'finish',
        usage: {
          cacheReadInputTokens: undefined,
          inputTokens: 10,
          outputTokens: 20,
          reasoningTokens: undefined,
          totalTokens: 30,
        },
      },
    ])
  })

  it('maps index-keyed tool call deltas to a tool-call part', async () => {
    await expect(readEvents([
      message({
        choices: [{
          delta: {
            tool_calls: [{
              function: { arguments: '', name: 'get_weather' },
              id: 'call_1',
              index: 0,
              type: 'function',
            }],
          },
          finish_reason: null,
          index: 0,
        }],
        id: 'chatcmpl_1',
      }),
      message({
        choices: [{
          delta: { tool_calls: [{ function: { arguments: '{"city":' }, index: 0 }] },
          finish_reason: null,
          index: 0,
        }],
        id: 'chatcmpl_1',
      }),
      message({
        choices: [{
          delta: { tool_calls: [{ function: { arguments: '"Taipei"}' }, index: 0 }] },
          finish_reason: null,
          index: 0,
        }],
        id: 'chatcmpl_1',
      }),
      message({
        choices: [{ delta: {}, finish_reason: 'tool_calls', index: 0 }],
        id: 'chatcmpl_1',
      }),
      message({
        choices: [],
        id: 'chatcmpl_1',
        usage: { completion_tokens: 20, prompt_tokens: 10, total_tokens: 30 },
      }),
      { data: '[DONE]' },
    ])).resolves.toEqual([
      { contentType: 'tool-call', index: 0, type: 'content.start' },
      {
        delta: '{"city":',
        id: 'call_1',
        index: 0,
        name: 'get_weather',
        type: 'tool-call.delta',
      },
      {
        delta: '"Taipei"}',
        id: 'call_1',
        index: 0,
        name: 'get_weather',
        type: 'tool-call.delta',
      },
      {
        content: {
          arguments: '{"city":"Taipei"}',
          callId: 'call_1',
          id: 'call_1',
          name: 'get_weather',
          type: 'tool-call',
        },
        index: 0,
        type: 'content.end',
      },
      {
        message: {
          content: [{
            arguments: '{"city":"Taipei"}',
            callId: 'call_1',
            id: 'call_1',
            name: 'get_weather',
            type: 'tool-call',
          }],
          role: 'assistant',
        },
        reason: 'tool-calls',
        responseId: 'chatcmpl_1',
        type: 'finish',
        usage: {
          cacheReadInputTokens: undefined,
          inputTokens: 10,
          outputTokens: 20,
          reasoningTokens: undefined,
          totalTokens: 30,
        },
      },
    ])
  })

  it('maps reasoning deltas to reasoning events and records the field used', async () => {
    await expect(readEvents([
      message({
        choices: [{ delta: { reasoning: 'Think' }, finish_reason: null, index: 0 }],
        id: 'chatcmpl_1',
      }),
      message({
        choices: [{ delta: { content: 'Done' }, finish_reason: null, index: 0 }],
        id: 'chatcmpl_1',
      }),
      message({
        choices: [{ delta: {}, finish_reason: 'stop', index: 0 }],
        id: 'chatcmpl_1',
      }),
      { data: '[DONE]' },
    ])).resolves.toEqual([
      { contentType: 'reasoning', index: 0, type: 'content.start' },
      { delta: 'Think', index: 0, type: 'reasoning.delta' },
      { contentType: 'text', index: 1, type: 'content.start' },
      { delta: 'Done', index: 1, type: 'text.delta' },
      {
        content: {
          content: [{ text: 'Think', type: 'text' }],
          metadata: { chat: { reasoning_field: 'reasoning' } },
          type: 'reasoning',
        },
        index: 0,
        type: 'content.end',
      },
      { content: { text: 'Done', type: 'text' }, index: 1, type: 'content.end' },
      {
        message: {
          content: [
            {
              content: [{ text: 'Think', type: 'text' }],
              metadata: { chat: { reasoning_field: 'reasoning' } },
              type: 'reasoning',
            },
            { text: 'Done', type: 'text' },
          ],
          role: 'assistant',
        },
        reason: 'stop',
        responseId: 'chatcmpl_1',
        type: 'finish',
      },
    ])
  })

  it('keeps the first non-empty tool call id and name', async () => {
    await expect(readEvents([
      message({
        choices: [{
          delta: {
            tool_calls: [{
              function: { arguments: '', name: 'get_weather' },
              id: 'call_1',
              index: 0,
              type: 'function',
            }],
          },
          finish_reason: null,
          index: 0,
        }],
        id: 'chatcmpl_1',
      }),
      // Some gateways repeat id/name as empty strings or null on
      // continuation deltas.
      message({
        choices: [{
          delta: { tool_calls: [{ function: { arguments: 'a', name: '' }, id: '', index: 0 }] },
          finish_reason: null,
          index: 0,
        }],
        id: 'chatcmpl_1',
      }),
      message({
        choices: [{
          delta: { tool_calls: [{ function: { arguments: 'b' }, id: null, index: 0 }] },
          finish_reason: null,
          index: 0,
        }],
        id: 'chatcmpl_1',
      }),
      message({
        choices: [{ delta: {}, finish_reason: 'tool_calls', index: 0 }],
        id: 'chatcmpl_1',
      }),
      { data: '[DONE]' },
    ])).resolves.toEqual([
      { contentType: 'tool-call', index: 0, type: 'content.start' },
      {
        delta: 'a',
        id: 'call_1',
        index: 0,
        name: 'get_weather',
        type: 'tool-call.delta',
      },
      {
        delta: 'b',
        id: 'call_1',
        index: 0,
        name: 'get_weather',
        type: 'tool-call.delta',
      },
      {
        content: {
          arguments: 'ab',
          callId: 'call_1',
          id: 'call_1',
          name: 'get_weather',
          type: 'tool-call',
        },
        index: 0,
        type: 'content.end',
      },
      {
        message: {
          content: [{
            arguments: 'ab',
            callId: 'call_1',
            id: 'call_1',
            name: 'get_weather',
            type: 'tool-call',
          }],
          role: 'assistant',
        },
        reason: 'tool-calls',
        responseId: 'chatcmpl_1',
        type: 'finish',
      },
    ])
  })

  it('mints an id when the wire never sends one', async () => {
    await expect(readEvents([
      message({
        choices: [{
          delta: { tool_calls: [{ function: { arguments: 'a', name: 't' }, index: 0 }] },
          finish_reason: null,
          index: 0,
        }],
        id: 'chatcmpl_1',
      }),
      message({
        choices: [{ delta: {}, finish_reason: 'tool_calls', index: 0 }],
        id: 'chatcmpl_1',
      }),
      { data: '[DONE]' },
    ])).resolves.toEqual([
      { contentType: 'tool-call', index: 0, type: 'content.start' },
      { delta: 'a', id: 'call_0', index: 0, name: 't', type: 'tool-call.delta' },
      {
        content: { arguments: 'a', callId: 'call_0', id: 'call_0', name: 't', type: 'tool-call' },
        index: 0,
        type: 'content.end',
      },
      {
        message: {
          content: [{ arguments: 'a', callId: 'call_0', id: 'call_0', name: 't', type: 'tool-call' }],
          role: 'assistant',
        },
        reason: 'tool-calls',
        responseId: 'chatcmpl_1',
        type: 'finish',
      },
    ])
  })

  it('reports cached tokens alongside verbatim input tokens', async () => {
    await expect(readEvents([
      message({
        choices: [{ delta: { content: 'hi' }, finish_reason: 'stop', index: 0 }],
        id: 'chatcmpl_1',
      }),
      message({
        choices: [],
        id: 'chatcmpl_1',
        usage: {
          completion_tokens: 20,
          prompt_cache_hit_tokens: 4,
          prompt_tokens: 10,
          prompt_tokens_details: { cached_tokens: 6 },
          total_tokens: 30,
        },
      }),
      { data: '[DONE]' },
    ])).resolves.toEqual([
      { contentType: 'text', index: 0, type: 'content.start' },
      { delta: 'hi', index: 0, type: 'text.delta' },
      { content: { text: 'hi', type: 'text' }, index: 0, type: 'content.end' },
      {
        message: {
          content: [{ text: 'hi', type: 'text' }],
          role: 'assistant',
        },
        reason: 'stop',
        responseId: 'chatcmpl_1',
        type: 'finish',
        usage: {
          // The wire's prompt_tokens already includes cached tokens.
          cacheReadInputTokens: 6,
          inputTokens: 10,
          outputTokens: 20,
          reasoningTokens: undefined,
          totalTokens: 30,
        },
      },
    ])
  })

  it('ignores null usage on non-terminal chunks', async () => {
    await expect(readEvents([
      message({
        choices: [{ delta: { content: 'hi' }, finish_reason: 'stop', index: 0 }],
        id: 'chatcmpl_1',
        usage: null,
      }),
      { data: '[DONE]' },
    ])).resolves.toEqual([
      { contentType: 'text', index: 0, type: 'content.start' },
      { delta: 'hi', index: 0, type: 'text.delta' },
      { content: { text: 'hi', type: 'text' }, index: 0, type: 'content.end' },
      {
        message: {
          content: [{ text: 'hi', type: 'text' }],
          role: 'assistant',
        },
        reason: 'stop',
        responseId: 'chatcmpl_1',
        type: 'finish',
      },
    ])
  })

  it('maps refusal deltas to a refusal part', async () => {
    await expect(readEvents([
      message({
        choices: [{ delta: { content: null, refusal: '' }, finish_reason: null, index: 0 }],
        id: 'chatcmpl_1',
      }),
      message({
        choices: [{ delta: { content: null, refusal: 'I refuse' }, finish_reason: null, index: 0 }],
        id: 'chatcmpl_1',
      }),
      // A delta carrying both produces both parts.
      message({
        choices: [{ delta: { content: 'more', refusal: 'x' }, finish_reason: null, index: 0 }],
        id: 'chatcmpl_1',
      }),
      message({
        choices: [{ delta: {}, finish_reason: 'stop', index: 0 }],
        id: 'chatcmpl_1',
      }),
      { data: '[DONE]' },
    ])).resolves.toEqual([
      { contentType: 'refusal', index: 0, type: 'content.start' },
      { delta: 'I refuse', index: 0, type: 'refusal.delta' },
      { contentType: 'text', index: 1, type: 'content.start' },
      { delta: 'more', index: 1, type: 'text.delta' },
      { delta: 'x', index: 0, type: 'refusal.delta' },
      { content: { refusal: 'I refusex', type: 'refusal' }, index: 0, type: 'content.end' },
      { content: { text: 'more', type: 'text' }, index: 1, type: 'content.end' },
      {
        message: {
          content: [
            { refusal: 'I refusex', type: 'refusal' },
            { text: 'more', type: 'text' },
          ],
          role: 'assistant',
        },
        reason: 'stop',
        responseId: 'chatcmpl_1',
        type: 'finish',
      },
    ])
  })

  it('skips delta-less choice frames and rejects on malformed chunks', async () => {
    await expect(readEvents([
      // Azure prepends prompt_filter_results frames with a delta-less choice.
      { data: '{"choices":[{"index":0,"finish_reason":null}],"id":"chatcmpl_1"}' },
      message({
        choices: [{ delta: { content: 'hi' }, finish_reason: 'stop', index: 0 }],
        id: 'chatcmpl_1',
      }),
      { data: 'not json' },
      { data: '[DONE]' },
    ])).rejects.toMatchObject({
      cause: expect.any(SyntaxError) as unknown,
      code: 'invalid-response',
      message: 'malformed event data',
    })
  })

  it('maps provider error chunks to an error finish', async () => {
    const events = await readEvents([
      message({
        error: { message: 'Internal server error', type: 'server_error' },
      }),
      { data: '[DONE]' },
    ])

    expect(events).toEqual([
      {
        error: expect.any(XSAIError) as unknown,
        message: { content: [], role: 'assistant' },
        reason: 'error',
        type: 'finish',
      },
    ])
    expect((events[0] as FinishEvent).error).toMatchObject({
      cause: { message: 'Internal server error', type: 'server_error' },
      code: 'model-error',
      message: 'Internal server error',
    })
  })
})
