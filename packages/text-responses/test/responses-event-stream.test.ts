import type { EventSourceMessage, StepEndEvent, TextEvent } from '@xsai/text-primitives'

import { EventSourceDataStream } from '@xsai/text-primitives'
import { XSAIError } from '@xsai/text-primitives/shared'
import { describe, expect, it } from 'vitest'

import { ResponsesEventStream } from '../src/utils/responses-event-stream'

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
    .pipeThrough(new ResponsesEventStream())
  const events: TextEvent[] = []
  for await (const event of stream)
    events.push(event)
  return events
}

const message = (data: unknown): EventSourceMessage => ({ data: JSON.stringify(data) })

describe('responses event stream', () => {
  it('maps Responses output events to text primitive events', async () => {
    await expect(readEvents([
      message({
        response: { id: 'resp_1', status: 'in_progress' },
        type: 'response.created',
      }),
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
          id: 'resp_1',
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
          status: 'completed',
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
      { type: 'step.start' },
      { contentType: 'tool-call', index: 0, type: 'content.start' },
      {
        callId: 'call_1',
        delta: '{"location":',
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
        reason: 'tool-calls',
        status: 'completed',
        type: 'step.end',
        usage: { inputTokens: 3, outputTokens: 2, totalTokens: 5 },
      },
    ])
  })

  it('maps refusal content to a refusal part, not text', async () => {
    await expect(readEvents([
      message({
        response: { id: 'resp_1', status: 'in_progress' },
        type: 'response.created',
      }),
      message({
        item: {
          content: [],
          id: 'message_1',
          role: 'assistant',
          status: 'in_progress',
          type: 'message',
        },
        output_index: 0,
        type: 'response.output_item.added',
      }),
      message({
        content_index: 0,
        delta: 'I cannot',
        item_id: 'message_1',
        output_index: 0,
        type: 'response.refusal.delta',
      }),
      message({
        item: {
          content: [{ refusal: 'I cannot help', type: 'refusal' }],
          id: 'message_1',
          role: 'assistant',
          status: 'completed',
          type: 'message',
        },
        output_index: 0,
        type: 'response.output_item.done',
      }),
      message({
        response: {
          id: 'resp_1',
          output: [{
            content: [{ refusal: 'I cannot help', type: 'refusal' }],
            id: 'message_1',
            role: 'assistant',
            status: 'completed',
            type: 'message',
          }],
          status: 'completed',
        },
        type: 'response.completed',
      }),
      { data: '[DONE]' },
    ])).resolves.toEqual([
      { type: 'step.start' },
      { contentType: 'refusal', index: 0, type: 'content.start' },
      { delta: 'I cannot', index: 0, type: 'refusal.delta' },
      { content: { refusal: 'I cannot help', type: 'refusal' }, index: 0, type: 'content.end' },
      {
        message: {
          content: [{ refusal: 'I cannot help', type: 'refusal' }],
          id: 'message_1',
          role: 'assistant',
        },
        reason: 'refusal',
        status: 'completed',
        type: 'step.end',
      },
    ])
  })

  it('keeps a message item\'s text and refusal as separate parts', async () => {
    await expect(readEvents([
      message({
        item: {
          content: [],
          id: 'message_1',
          role: 'assistant',
          status: 'in_progress',
          type: 'message',
        },
        output_index: 0,
        type: 'response.output_item.added',
      }),
      message({
        content_index: 0,
        item_id: 'message_1',
        output_index: 0,
        part: { text: '', type: 'output_text' },
        type: 'response.content_part.added',
      }),
      message({
        content_index: 0,
        delta: 'partial',
        item_id: 'message_1',
        output_index: 0,
        type: 'response.output_text.delta',
      }),
      message({
        content_index: 0,
        item_id: 'message_1',
        output_index: 0,
        part: { text: 'partial', type: 'output_text' },
        type: 'response.content_part.done',
      }),
      message({
        content_index: 1,
        item_id: 'message_1',
        output_index: 0,
        part: { refusal: '', type: 'refusal' },
        type: 'response.content_part.added',
      }),
      message({
        content_index: 1,
        delta: 'I cannot',
        item_id: 'message_1',
        output_index: 0,
        type: 'response.refusal.delta',
      }),
      message({
        content_index: 1,
        item_id: 'message_1',
        output_index: 0,
        part: { refusal: 'I cannot continue', type: 'refusal' },
        type: 'response.content_part.done',
      }),
      message({
        item: {
          content: [
            { annotations: [], text: 'partial', type: 'output_text' },
            { refusal: 'I cannot continue', type: 'refusal' },
          ],
          id: 'message_1',
          role: 'assistant',
          status: 'completed',
          type: 'message',
        },
        output_index: 0,
        type: 'response.output_item.done',
      }),
      message({
        response: {
          id: 'resp_1',
          output: [{
            content: [
              { annotations: [], text: 'partial', type: 'output_text' },
              { refusal: 'I cannot continue', type: 'refusal' },
            ],
            id: 'message_1',
            role: 'assistant',
            status: 'completed',
            type: 'message',
          }],
          status: 'completed',
        },
        type: 'response.completed',
      }),
      { data: '[DONE]' },
    ])).resolves.toEqual([
      { type: 'step.start' },
      { contentType: 'text', index: 0, type: 'content.start' },
      { delta: 'partial', index: 0, type: 'text.delta' },
      { content: { text: 'partial', type: 'text' }, index: 0, type: 'content.end' },
      { contentType: 'refusal', index: 1, type: 'content.start' },
      { delta: 'I cannot', index: 1, type: 'refusal.delta' },
      { content: { refusal: 'I cannot continue', type: 'refusal' }, index: 1, type: 'content.end' },
      {
        message: {
          content: [
            { text: 'partial', type: 'text' },
            { refusal: 'I cannot continue', type: 'refusal' },
          ],
          id: 'message_1',
          role: 'assistant',
        },
        reason: 'refusal',
        status: 'completed',
        type: 'step.end',
      },
    ])
  })

  it('maps provider error events to a step.end error', async () => {
    const events = await readEvents([
      message({
        error: { code: 'server_error', message: 'something went wrong' },
        type: 'error',
      }),
      { data: '[DONE]' },
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
      cause: { code: 'server_error', message: 'something went wrong' },
      code: 'model-error',
      message: 'something went wrong',
    })
  })

  it('maps failed responses to a step.end error', async () => {
    const events = await readEvents([
      message({
        response: {
          error: { code: 'server_error', message: 'something went wrong' },
          id: 'resp_1',
          incomplete_details: null,
          output: [],
          status: 'failed',
          usage: null,
        },
        type: 'response.failed',
      }),
      { data: '[DONE]' },
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
      cause: { code: 'server_error', message: 'something went wrong' },
      code: 'model-error',
      message: 'something went wrong',
    })
  })

  it('does not use a failed response envelope as the error cause', async () => {
    const events = await readEvents([
      message({
        response: {
          error: null,
          id: 'resp_1',
          incomplete_details: null,
          output: [],
          status: 'failed',
          usage: null,
        },
        type: 'response.failed',
      }),
      { data: '[DONE]' },
    ])

    expect((events[1] as StepEndEvent).error).toMatchObject({
      code: 'model-error',
      message: 'response failed',
    })
    expect((events[1] as StepEndEvent).error).not.toMatchObject({
      cause: { id: 'resp_1', status: 'failed' },
    })
  })

  it('maps reasoning text output and incomplete reasons', async () => {
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
        content_index: 0,
        delta: 'Think',
        item_id: 'reasoning_1',
        output_index: 0,
        type: 'response.reasoning_text.delta',
      }),
      message({
        content_index: 0,
        item_id: 'reasoning_1',
        output_index: 0,
        text: 'Think',
        type: 'response.reasoning_text.done',
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
          id: 'resp_1',
          incomplete_details: { reason: 'max_output_tokens' },
          output: [{
            content: [{ text: 'Think', type: 'reasoning_text' }],
            encrypted_content: 'encrypted',
            id: 'reasoning_1',
            status: 'incomplete',
            summary: [{ text: 'Think more', type: 'summary_text' }],
            type: 'reasoning',
          }],
          status: 'incomplete',
          usage: null,
        },
        type: 'response.incomplete',
      }),
      { data: '[DONE]' },
    ])).resolves.toEqual([
      { type: 'step.start' },
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
        reason: 'length',
        status: 'incomplete',
        type: 'step.end',
      },
    ])
  })

  it('finishes incomplete without a reason as incomplete, not stop', async () => {
    await expect(readEvents([
      message({
        response: {
          error: null,
          id: 'resp_1',
          incomplete_details: null,
          output: [],
          status: 'incomplete',
          usage: null,
        },
        type: 'response.incomplete',
      }),
      { data: '[DONE]' },
    ])).resolves.toEqual([
      { type: 'step.start' },
      {
        message: { content: [], role: 'assistant' },
        status: 'incomplete',
        type: 'step.end',
      },
    ])
  })

  it('does not infer refusal for cancelled responses', async () => {
    await expect(readEvents([
      message({
        response: {
          error: null,
          id: 'resp_1',
          incomplete_details: null,
          output: [{
            content: [{ refusal: 'I cannot help', type: 'refusal' }],
            id: 'message_1',
            role: 'assistant',
            status: 'completed',
            type: 'message',
          }],
          status: 'cancelled',
          usage: null,
        },
        type: 'response.incomplete',
      }),
      { data: '[DONE]' },
    ])).resolves.toEqual([
      { type: 'step.start' },
      {
        message: {
          content: [{ refusal: 'I cannot help', type: 'refusal' }],
          id: 'message_1',
          role: 'assistant',
        },
        status: 'cancelled',
        type: 'step.end',
      },
    ])
  })

  it('passes through unmodelled terminal statuses instead of mapping them to stop', async () => {
    await expect(readEvents([
      message({
        response: {
          error: null,
          id: 'resp_1',
          incomplete_details: null,
          output: [],
          status: 'cancelled',
          usage: null,
        },
        type: 'response.incomplete',
      }),
      { data: '[DONE]' },
    ])).resolves.toEqual([
      { type: 'step.start' },
      {
        message: { content: [], role: 'assistant' },
        status: 'cancelled',
        type: 'step.end',
      },
    ])
  })

  it('rejects unknown response statuses as protocol errors', async () => {
    const messages = [
      message({
        response: {
          error: null,
          id: 'resp_1',
          incomplete_details: null,
          output: [],
          status: 'future_status',
          usage: null,
        },
        type: 'response.completed',
      }),
      { data: '[DONE]' },
    ]
    let error: unknown
    try {
      await readEvents(messages)
    }
    catch (cause) {
      error = cause
    }

    expect(error).toMatchObject({
      cause: { message: 'unknown response status: future_status' },
      code: 'protocol-error',
      message: 'failed to normalize wire event',
    })
    expect((error as { cause?: unknown }).cause).not.toBeInstanceOf(XSAIError)
  })
})
