import type { Event, EventSourceMessage } from '@xsai/text-primitives'

import { EventSourceDataStream } from '@xsai/text-primitives'
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
    .pipeThrough(new EventSourceDataStream(true))
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
          id: 'chatcmpl_1',
          role: 'assistant',
        },
        reason: 'stop',
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
          id: 'chatcmpl_1',
          role: 'assistant',
        },
        reason: 'tool-calls',
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

  it('maps reasoning_content deltas to reasoning events', async () => {
    await expect(readEvents([
      message({
        choices: [{ delta: { reasoning_content: 'Think' }, finish_reason: null, index: 0 }],
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
        content: { content: [{ text: 'Think', type: 'text' }], type: 'reasoning' },
        index: 0,
        type: 'content.end',
      },
      { content: { text: 'Done', type: 'text' }, index: 1, type: 'content.end' },
      {
        message: {
          content: [
            { content: [{ text: 'Think', type: 'text' }], type: 'reasoning' },
            { text: 'Done', type: 'text' },
          ],
          id: 'chatcmpl_1',
          role: 'assistant',
        },
        reason: 'stop',
        type: 'finish',
      },
    ])
  })

  it('maps provider error chunks to error events', async () => {
    await expect(readEvents([
      message({
        error: { message: 'Internal server error', type: 'server_error' },
      }),
      { data: '[DONE]' },
    ])).resolves.toEqual([
      {
        cause: { message: 'Internal server error', type: 'server_error' },
        message: 'Internal server error',
        type: 'error',
      },
    ])
  })
})
