import { rawTool } from '@xsai/tool'
import { describe, expect, it, vi } from 'vitest'

import { streamText } from '../src'

const chatMock = vi.fn()

vi.mock('@xsai/shared-chat', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@xsai/shared-chat')>()
  return {
    ...actual,
    chat: chatMock,
  }
})

const wait = async (ms: number) => new Promise((resolve) => {
  const timer = setTimeout(resolve, ms)
  return () => clearTimeout(timer)
})

const makeStreamResponse = (chunks: object[]) => {
  const encoder = new TextEncoder()
  const stream = new ReadableStream<Uint8Array>({
    start: (controller) => {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`))
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      controller.close()
    },
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream' },
    status: 200,
  })
}

describe('@xsai/stream-text parallel tool calls', () => {
  it('executes tool calls concurrently when enabled', async () => {
    const order: string[] = []

    const toolA = rawTool({
      execute: async () => {
        order.push('a-start')
        await wait(20)
        order.push('a-end')
        return 'a'
      },
      name: 'tool_a',
      parameters: {
        additionalProperties: false,
        properties: {
          value: { type: 'string' },
        },
        required: ['value'],
        type: 'object',
      },
    })

    const toolB = rawTool({
      execute: async () => {
        order.push('b-start')
        await wait(5)
        order.push('b-end')
        return 'b'
      },
      name: 'tool_b',
      parameters: {
        additionalProperties: false,
        properties: {
          value: { type: 'string' },
        },
        required: ['value'],
        type: 'object',
      },
    })

    const response = makeStreamResponse([{
      choices: [{
        delta: {
          role: 'assistant',
          tool_calls: [
            {
              function: {
                arguments: '{"value":"a"}',
                name: 'tool_a',
              },
              id: 'call_a',
              index: 0,
              type: 'function',
            },
            {
              function: {
                arguments: '{"value":"b"}',
                name: 'tool_b',
              },
              id: 'call_b',
              index: 1,
              type: 'function',
            },
          ],
        },
        finish_reason: 'tool_calls',
        index: 0,
      }],
      created: Date.now(),
      id: 'chatcmpl-tool-calls',
      model: 'test',
      object: 'chat.completion.chunk',
      system_fingerprint: 'test',
    }])

    chatMock.mockResolvedValueOnce(response)

    const { steps } = streamText({
      baseURL: 'http://localhost:11434/v1/',
      messages: [{
        content: 'Call both tools',
        role: 'user',
      }],
      model: 'test',
      parallelToolCalls: true,
      tools: [toolA, toolB],
    })

    const allSteps = await steps

    expect(allSteps[0].toolCalls.length).toBe(2)
    expect(order.indexOf('b-start')).toBeGreaterThan(-1)
    expect(order.indexOf('a-end')).toBeGreaterThan(-1)
    expect(order.indexOf('b-start')).toBeLessThan(order.indexOf('a-end'))
  })
})
