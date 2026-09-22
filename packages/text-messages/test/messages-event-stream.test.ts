import type { EventSourceMessage, StepEndEvent, TextEvent } from '@xsai/text-primitives'

import { EventSourceDataStream } from '@xsai/text-primitives'
import { XSAIError } from '@xsai/text-primitives/shared'
import { describe, expect, it } from 'vitest'

import { MessagesEventStream } from '../src/utils/messages-event-stream'

const readEvents = async (messages: EventSourceMessage[]): Promise<TextEvent[]> => {
  const source = new ReadableStream<EventSourceMessage>({
    start: (controller) => {
      for (const message of messages)
        controller.enqueue(message)

      controller.close()
    },
  })
  const stream = source
    .pipeThrough(new EventSourceDataStream())
    .pipeThrough(new MessagesEventStream())
  const events: TextEvent[] = []
  for await (const event of stream)
    events.push(event)
  return events
}

const message = (data: unknown): EventSourceMessage => ({ data: JSON.stringify(data) })

describe('messages event stream', () => {
  it('maps Messages output events to text primitive events', async () => {
    await expect(readEvents([
      message({
        message: {
          id: 'msg_1',
          usage: { cache_read_input_tokens: 4, input_tokens: 10, output_tokens: 1 },
        },
        type: 'message_start',
      }),
      message({
        content_block: { text: '', type: 'text' },
        index: 0,
        type: 'content_block_start',
      }),
      message({
        delta: { text: 'Hello', type: 'text_delta' },
        index: 0,
        type: 'content_block_delta',
      }),
      message({ index: 0, type: 'content_block_stop' }),
      message({
        content_block: { id: 'toolu_1', input: {}, name: 'weather', type: 'tool_use' },
        index: 1,
        type: 'content_block_start',
      }),
      message({
        delta: { partial_json: '{"city":', type: 'input_json_delta' },
        index: 1,
        type: 'content_block_delta',
      }),
      message({
        delta: { partial_json: '"Taipei"}', type: 'input_json_delta' },
        index: 1,
        type: 'content_block_delta',
      }),
      message({ index: 1, type: 'content_block_stop' }),
      message({
        delta: { stop_reason: 'tool_use' },
        type: 'message_delta',
        usage: { output_tokens: 20 },
      }),
      message({ type: 'message_stop' }),
    ])).resolves.toEqual([
      { type: 'step.start' },
      { contentType: 'text', index: 0, type: 'content.start' },
      { delta: 'Hello', index: 0, type: 'text.delta' },
      { content: { text: 'Hello', type: 'text' }, index: 0, type: 'content.end' },
      { contentType: 'tool-call', index: 1, type: 'content.start' },
      {
        callId: 'toolu_1',
        delta: '{"city":',
        index: 1,
        name: 'weather',
        type: 'tool-call.delta',
      },
      {
        callId: 'toolu_1',
        delta: '"Taipei"}',
        index: 1,
        name: 'weather',
        type: 'tool-call.delta',
      },
      {
        content: {
          arguments: '{"city":"Taipei"}',
          callId: 'toolu_1',
          id: 'toolu_1',
          name: 'weather',
          type: 'tool-call',
        },
        index: 1,
        type: 'content.end',
      },
      {
        message: {
          content: [
            { text: 'Hello', type: 'text' },
            {
              arguments: '{"city":"Taipei"}',
              callId: 'toolu_1',
              id: 'toolu_1',
              name: 'weather',
              type: 'tool-call',
            },
          ],
          id: 'msg_1',
          role: 'assistant',
        },
        reason: 'tool-calls',
        status: 'completed',
        type: 'step.end',
        usage: {
          cacheCreationInputTokens: undefined,
          cacheReadInputTokens: 4,
          inputTokens: 10,
          outputTokens: 20,
          reasoningTokens: undefined,
          totalTokens: 34,
        },
      },
    ])
  })

  it('assembles thinking blocks with streamed signatures', async () => {
    await expect(readEvents([
      message({
        message: { id: 'msg_1', usage: { input_tokens: 5, output_tokens: 1 } },
        type: 'message_start',
      }),
      message({
        content_block: { thinking: '', type: 'thinking' },
        index: 0,
        type: 'content_block_start',
      }),
      message({
        delta: { thinking: 'Think', type: 'thinking_delta' },
        index: 0,
        type: 'content_block_delta',
      }),
      message({
        delta: { signature: 'sig_1', type: 'signature_delta' },
        index: 0,
        type: 'content_block_delta',
      }),
      message({ index: 0, type: 'content_block_stop' }),
      message({
        delta: { stop_reason: 'end_turn' },
        type: 'message_delta',
        usage: { output_tokens: 8, output_tokens_details: { thinking_tokens: 5 } },
      }),
      message({ type: 'message_stop' }),
    ])).resolves.toEqual([
      { type: 'step.start' },
      { contentType: 'reasoning', index: 0, type: 'content.start' },
      { delta: 'Think', index: 0, type: 'reasoning.delta' },
      {
        content: {
          content: [{ text: 'Think', type: 'text' }],
          providerMetadata: { messages: { signature: 'sig_1' } },
          type: 'reasoning',
        },
        index: 0,
        type: 'content.end',
      },
      {
        message: {
          content: [{
            content: [{ text: 'Think', type: 'text' }],
            providerMetadata: { messages: { signature: 'sig_1' } },
            type: 'reasoning',
          }],
          id: 'msg_1',
          role: 'assistant',
        },
        reason: 'stop',
        status: 'completed',
        type: 'step.end',
        usage: {
          cacheCreationInputTokens: undefined,
          cacheReadInputTokens: undefined,
          inputTokens: 5,
          outputTokens: 8,
          reasoningTokens: 5,
          totalTokens: 13,
        },
      },
    ])
  })

  it('maps a refusal stop reason to a step.end refusal', async () => {
    await expect(readEvents([
      message({
        message: { id: 'msg_1', usage: { input_tokens: 10 } },
        type: 'message_start',
      }),
      message({
        delta: { stop_reason: 'refusal', stop_sequence: null },
        type: 'message_delta',
        usage: { output_tokens: 0 },
      }),
      message({ type: 'message_stop' }),
    ])).resolves.toEqual([
      { type: 'step.start' },
      {
        message: { content: [], id: 'msg_1', role: 'assistant' },
        reason: 'refusal',
        status: 'completed',
        type: 'step.end',
        usage: {
          cacheCreationInputTokens: undefined,
          cacheReadInputTokens: undefined,
          inputTokens: 10,
          outputTokens: 0,
          reasoningTokens: undefined,
          totalTokens: 10,
        },
      },
    ])
  })

  it('maps provider error events to a step.end error', async () => {
    const events = await readEvents([
      message({
        error: { message: 'Overloaded', type: 'overloaded_error' },
        type: 'error',
      }),
    ])

    expect(events).toEqual([
      { type: 'step.start' },
      {
        error: expect.any(XSAIError) as unknown,
        message: { content: [], role: 'assistant' },
        status: 'failed',
        type: 'step.end',
      },
    ])
    expect((events[1] as StepEndEvent).error).toMatchObject({
      cause: { message: 'Overloaded', type: 'overloaded_error' },
      code: 'model-error',
      message: 'Overloaded',
    })
  })
})
