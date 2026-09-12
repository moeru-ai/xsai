import type { Event, EventSourceMessage } from '@xsai/text-primitives'

import { EventSourceDataStream } from '@xsai/text-primitives'
import { describe, expect, it } from 'vitest'

import { ResponsesEventStream } from '../src/utils/responses-event-stream'

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
    .pipeThrough(new ResponsesEventStream())
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

describe('responses event stream', () => {
  it('maps Responses output events to text primitive events', async () => {
    await expect(readEvents([
      message({
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
      }),
      message({
        delta: '{"location":',
        item_id: 'fc_1',
        output_index: 0,
        type: 'response.function_call_arguments.delta',
      }),
      message({
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
      }),
      message({
        item: {
          content: [],
          id: 'message_1',
          role: 'assistant',
          status: 'in_progress',
          type: 'message',
        },
        output_index: 1,
        type: 'response.output_item.added',
      }),
      message({
        content_index: 0,
        delta: 'Hello',
        item_id: 'message_1',
        output_index: 1,
        type: 'response.output_text.delta',
      }),
      message({
        item: {
          content: [{ annotations: [], text: 'Hello', type: 'output_text' }],
          id: 'message_1',
          role: 'assistant',
          status: 'completed',
          type: 'message',
        },
        output_index: 1,
        type: 'response.output_item.done',
      }),
      message({
        response: {
          error: null,
          incomplete_details: null,
          output: [
            {
              arguments: '{"location":"Taipei"}',
              call_id: 'call_1',
              id: 'fc_1',
              name: 'weather',
              status: 'completed',
              type: 'function_call',
            },
            {
              content: [{ annotations: [], text: 'Hello', type: 'output_text' }],
              id: 'message_1',
              role: 'assistant',
              status: 'completed',
              type: 'message',
            },
          ],
          usage: {
            input_tokens: 3,
            output_tokens: 2,
            total_tokens: 5,
          },
        },
        type: 'response.completed',
      }),
      { data: '[DONE]' },
    ])).resolves.toEqual([
      { contentType: 'tool-call', index: 0, type: 'content.start' },
      {
        delta: '{"location":',
        id: 'fc_1',
        index: 0,
        name: 'weather',
        type: 'tool-call.delta',
      },
      {
        content: {
          arguments: '{"location":"Taipei"}',
          callId: 'call_1',
          id: 'fc_1',
          name: 'weather',
          type: 'tool-call',
        },
        index: 0,
        type: 'content.end',
      },
      { contentType: 'text', index: 1, type: 'content.start' },
      { delta: 'Hello', index: 1, type: 'text.delta' },
      { content: { text: 'Hello', type: 'text' }, index: 1, type: 'content.end' },
      {
        message: {
          content: [
            {
              arguments: '{"location":"Taipei"}',
              callId: 'call_1',
              id: 'fc_1',
              name: 'weather',
              type: 'tool-call',
            },
            { text: 'Hello', type: 'text' },
          ],
          id: 'message_1',
          role: 'assistant',
        },
        reason: 'stop',
        type: 'finish',
        usage: { inputTokens: 3, outputTokens: 2, totalTokens: 5 },
      },
    ])
  })

  it('maps provider error events without ending the stream', async () => {
    await expect(readEvents([
      message({
        error: { code: 'server_error', message: 'something went wrong' },
        type: 'error',
      }),
      { data: '[DONE]' },
    ])).resolves.toEqual([
      {
        cause: { code: 'server_error', message: 'something went wrong' },
        message: 'something went wrong',
        type: 'error',
      },
    ])
  })

  it('maps reasoning output and incomplete reasons', async () => {
    await expect(readEvents([
      message({
        item: {
          id: 'reasoning_1',
          type: 'reasoning',
        },
        output_index: 0,
        type: 'response.output_item.added',
      }),
      message({
        delta: 'Think',
        output_index: 0,
        type: 'response.reasoning.delta',
      }),
      message({
        delta: ' more',
        output_index: 0,
        type: 'response.reasoning_summary_text.delta',
      }),
      message({
        item: {
          content: [{ text: 'Think', type: 'reasoning_text' }],
          encrypted_content: 'encrypted',
          id: 'reasoning_1',
          summary: [{ text: 'Think more', type: 'summary_text' }],
          type: 'reasoning',
        },
        output_index: 0,
        type: 'response.output_item.done',
      }),
      message({
        response: {
          error: null,
          incomplete_details: { reason: 'max_output_tokens' },
          output: [{
            content: [{ text: 'Think', type: 'reasoning_text' }],
            encrypted_content: 'encrypted',
            id: 'reasoning_1',
            status: 'incomplete',
            summary: [{ text: 'Think more', type: 'summary_text' }],
            type: 'reasoning',
          }],
          usage: null,
        },
        type: 'response.incomplete',
      }),
      { data: '[DONE]' },
    ])).resolves.toEqual([
      { contentType: 'reasoning', index: 0, type: 'content.start' },
      { delta: 'Think', index: 0, type: 'reasoning.delta' },
      { delta: ' more', index: 0, type: 'reasoning.delta' },
      {
        content: {
          content: [
            { text: 'Think more', type: 'summary' },
            { text: 'Think', type: 'text' },
            { text: 'encrypted', type: 'encrypted' },
          ],
          id: 'reasoning_1',
          type: 'reasoning',
        },
        index: 0,
        type: 'content.end',
      },
      {
        message: {
          content: [{
            content: [
              { text: 'Think more', type: 'summary' },
              { text: 'Think', type: 'text' },
              { text: 'encrypted', type: 'encrypted' },
            ],
            id: 'reasoning_1',
            type: 'reasoning',
          }],
          role: 'assistant',
        },
        reason: 'max-output-tokens',
        type: 'finish',
      },
    ])
  })
})
