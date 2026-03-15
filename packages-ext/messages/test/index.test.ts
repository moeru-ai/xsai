import type { StreamingEvent } from '../src/types/streaming-event'

import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'

import { messages, tool } from '../src'
import { createEventStreamResponse } from './utils'

describe('@xsai-ext/messages basic', async () => {
  it('streams text, thinking, steps, and usage', async () => {
    const fetch = vi.fn<typeof globalThis.fetch>().mockResolvedValue(createEventStreamResponse([
      {
        message: {
          content: [],
          id: 'msg_1',
          model: 'claude-sonnet-4-5',
          role: 'assistant',
          stop_reason: null,
          stop_sequence: null,
          type: 'message',
          usage: {
            input_tokens: 7,
            output_tokens: 0,
          },
        },
        type: 'message_start',
      },
      {
        content_block: {
          signature: '',
          thinking: '',
          type: 'thinking',
        },
        index: 0,
        type: 'content_block_start',
      },
      {
        delta: {
          thinking: 'I should answer briefly. ',
          type: 'thinking_delta',
        },
        index: 0,
        type: 'content_block_delta',
      },
      {
        delta: {
          signature: 'sig_1',
          type: 'signature_delta',
        },
        index: 0,
        type: 'content_block_delta',
      },
      {
        index: 0,
        type: 'content_block_stop',
      },
      {
        content_block: {
          text: '',
          type: 'text',
        },
        index: 1,
        type: 'content_block_start',
      },
      {
        delta: {
          text: 'Hello',
          type: 'text_delta',
        },
        index: 1,
        type: 'content_block_delta',
      },
      {
        delta: {
          text: '!',
          type: 'text_delta',
        },
        index: 1,
        type: 'content_block_delta',
      },
      {
        index: 1,
        type: 'content_block_stop',
      },
      {
        delta: {
          stop_reason: 'end_turn',
          stop_sequence: null,
        },
        type: 'message_delta',
        usage: {
          cache_creation_input_tokens: null,
          cache_read_input_tokens: null,
          input_tokens: null,
          output_tokens: 2,
        },
      },
      {
        type: 'message_stop',
      },
    ]))

    const { eventStream, reasoningTextStream, steps, textStream, totalUsage, usage } = messages({
      fetch,
      max_tokens: 128,
      messages: [{ content: 'Hello?', role: 'user' }],
      model: 'claude-sonnet-4-5',
    })

    let text = ''
    for await (const chunk of textStream) {
      text += chunk
    }

    let reasoningText = ''
    for await (const chunk of reasoningTextStream) {
      reasoningText += chunk
    }

    const events: StreamingEvent[] = []
    for await (const event of eventStream) {
      events.push(event)
    }

    expect(text).toBe('Hello!')
    expect(reasoningText).toBe('I should answer briefly. ')
    expect(events.map(event => event.type)).toEqual([
      'message_start',
      'content_block_start',
      'content_block_delta',
      'content_block_delta',
      'content_block_stop',
      'content_block_start',
      'content_block_delta',
      'content_block_delta',
      'content_block_stop',
      'message_delta',
      'message_stop',
    ])

    await expect(steps).resolves.toEqual([
      {
        finishReason: 'stop',
        message: {
          content: [
            {
              signature: 'sig_1',
              thinking: 'I should answer briefly. ',
              type: 'thinking',
            },
            {
              text: 'Hello!',
              type: 'text',
            },
          ],
          id: 'msg_1',
          model: 'claude-sonnet-4-5',
          role: 'assistant',
          stop_reason: 'end_turn',
          stop_sequence: null,
          type: 'message',
          usage: {
            input_tokens: 7,
            output_tokens: 2,
          },
        },
        reasoningText: 'I should answer briefly. ',
        stopReason: 'end_turn',
        text: 'Hello!',
        toolResults: [],
        toolUses: [],
        usage: {
          input_tokens: 7,
          output_tokens: 2,
        },
      },
    ])
    await expect(usage).resolves.toEqual({ input_tokens: 7, output_tokens: 2 })
    await expect(totalUsage).resolves.toEqual({ input_tokens: 7, output_tokens: 2 })
  })

  it('rejects result promises when the initial stream setup fails', async () => {
    const error = new Error('boom')
    const fetch = vi.fn<typeof globalThis.fetch>().mockRejectedValue(error)

    const { eventStream, steps, totalUsage, usage } = messages({
      fetch,
      max_tokens: 128,
      messages: [{ content: 'Hello?', role: 'user' }],
      model: 'claude-sonnet-4-5',
    })

    await expect(eventStream.getReader().read()).rejects.toThrow(error)
    await expect(steps).rejects.toThrow(error)
    await expect(usage).rejects.toThrow(error)
    await expect(totalUsage).rejects.toThrow(error)
  })

  it('does not emit unhandled rejections when auxiliary promises are ignored', async () => {
    const error = new Error('boom')
    const fetch = vi.fn<typeof globalThis.fetch>().mockRejectedValue(error)
    const onUnhandledRejection = vi.fn()

    process.on('unhandledRejection', onUnhandledRejection)

    try {
      const { textStream } = messages({
        fetch,
        max_tokens: 128,
        messages: [{ content: 'Hello?', role: 'user' }],
        model: 'claude-sonnet-4-5',
      })

      await expect((async () => {
        for await (const chunk of textStream) {
          void chunk
        }
      })()).rejects.toThrow(error)

      await Promise.resolve()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(onUnhandledRejection).not.toHaveBeenCalled()
    }
    finally {
      process.off('unhandledRejection', onUnhandledRejection)
    }
  })
})

describe('@xsai-ext/messages tool', async () => {
  it('emits message_stop before starting the next tool step', async () => {
    const add = tool({
      description: 'Adds two numbers',
      execute: ({ a, b }) => (Number.parseInt(a, 10) + Number.parseInt(b, 10)).toString(),
      inputSchema: z.object({
        a: z.string(),
        b: z.string(),
      }),
      name: 'add',
    })

    const fetch = vi.fn<typeof globalThis.fetch>()
      .mockResolvedValueOnce(createEventStreamResponse([
        {
          message: {
            content: [],
            id: 'msg_1',
            model: 'claude-sonnet-4-5',
            role: 'assistant',
            stop_reason: null,
            stop_sequence: null,
            type: 'message',
            usage: {
              input_tokens: 10,
              output_tokens: 0,
            },
          },
          type: 'message_start',
        },
        {
          content_block: {
            id: 'toolu_1',
            input: {},
            name: 'add',
            type: 'tool_use',
          },
          index: 0,
          type: 'content_block_start',
        },
        {
          delta: {
            partial_json: '{"a":"1"',
            type: 'input_json_delta',
          },
          index: 0,
          type: 'content_block_delta',
        },
        {
          delta: {
            partial_json: ',"b":"2"}',
            type: 'input_json_delta',
          },
          index: 0,
          type: 'content_block_delta',
        },
        {
          index: 0,
          type: 'content_block_stop',
        },
        {
          delta: {
            stop_reason: 'tool_use',
            stop_sequence: null,
          },
          type: 'message_delta',
          usage: {
            cache_creation_input_tokens: null,
            cache_read_input_tokens: null,
            input_tokens: null,
            output_tokens: 5,
          },
        },
        {
          type: 'message_stop',
        },
      ]))
      .mockResolvedValueOnce(createEventStreamResponse([
        {
          message: {
            content: [],
            id: 'msg_2',
            model: 'claude-sonnet-4-5',
            role: 'assistant',
            stop_reason: null,
            stop_sequence: null,
            type: 'message',
            usage: {
              input_tokens: 13,
              output_tokens: 0,
            },
          },
          type: 'message_start',
        },
        {
          content_block: {
            text: '',
            type: 'text',
          },
          index: 0,
          type: 'content_block_start',
        },
        {
          delta: {
            text: '3',
            type: 'text_delta',
          },
          index: 0,
          type: 'content_block_delta',
        },
        {
          index: 0,
          type: 'content_block_stop',
        },
        {
          delta: {
            stop_reason: 'end_turn',
            stop_sequence: null,
          },
          type: 'message_delta',
          usage: {
            cache_creation_input_tokens: null,
            cache_read_input_tokens: null,
            input_tokens: null,
            output_tokens: 1,
          },
        },
        {
          type: 'message_stop',
        },
      ]))

    const { eventStream, steps, totalUsage, usage } = messages({
      fetch,
      max_tokens: 128,
      messages: [{ content: 'Please use the tool.', role: 'user' }],
      model: 'claude-sonnet-4-5',
      tool_choice: { type: 'any' },
      tools: [add],
    })

    const events: StreamingEvent[] = []
    for await (const event of eventStream) {
      events.push(event)
    }

    expect(events.map(event => event.type)).toEqual([
      'message_start',
      'content_block_start',
      'content_block_delta',
      'content_block_delta',
      'content_block_stop',
      'message_delta',
      'message_stop',
      'message_start',
      'content_block_start',
      'content_block_delta',
      'content_block_stop',
      'message_delta',
      'message_stop',
    ])

    await expect(steps).resolves.toMatchObject([
      {
        finishReason: 'tool-calls',
        stopReason: 'tool_use',
        toolResults: [
          {
            content: '3',
            tool_use_id: 'toolu_1',
            type: 'tool_result',
          },
        ],
        toolUses: [
          {
            id: 'toolu_1',
            input: {
              a: '1',
              b: '2',
            },
            name: 'add',
            type: 'tool_use',
          },
        ],
      },
      {
        finishReason: 'stop',
        stopReason: 'end_turn',
        text: '3',
      },
    ])
    await expect(usage).resolves.toEqual({ input_tokens: 13, output_tokens: 1 })
    await expect(totalUsage).resolves.toEqual({ input_tokens: 23, output_tokens: 6 })
    expect(fetch).toHaveBeenCalledTimes(2)

    const secondRequestInit = fetch.mock.calls[1]?.[1] as RequestInit
    const secondRequestBody = JSON.parse(secondRequestInit.body as string) as {
      messages: Array<{ content: unknown, role: string }>
    }

    expect(secondRequestBody.messages.at(-1)).toEqual({
      content: [
        {
          content: '3',
          tool_use_id: 'toolu_1',
          type: 'tool_result',
        },
      ],
      role: 'user',
    })
  })
})
