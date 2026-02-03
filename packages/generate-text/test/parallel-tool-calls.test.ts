import { rawTool } from '@xsai/tool'
import { describe, expect, it, vi } from 'vitest'

import { generateText } from '../src'

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

describe('@xsai/generate-text parallel tool calls', () => {
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

    const toolCallsResponse = new Response(JSON.stringify({
      choices: [{
        finish_reason: 'tool_calls',
        index: 0,
        message: {
          content: '',
          role: 'assistant',
          tool_calls: [
            {
              function: {
                arguments: '{"value":"a"}',
                name: 'tool_a',
              },
              id: 'call_a',
              type: 'function',
            },
            {
              function: {
                arguments: '{"value":"b"}',
                name: 'tool_b',
              },
              id: 'call_b',
              type: 'function',
            },
          ],
        },
      }],
      created: Date.now(),
      id: 'chatcmpl-tool-calls',
      model: 'test',
      object: 'chat.completion',
      system_fingerprint: 'test',
      usage: {
        completion_tokens: 1,
        prompt_tokens: 1,
        total_tokens: 2,
      },
    }), { headers: { 'Content-Type': 'application/json' }, status: 200 })

    const finalResponse = new Response(JSON.stringify({
      choices: [{
        finish_reason: 'stop',
        index: 0,
        message: {
          content: 'done',
          role: 'assistant',
        },
      }],
      created: Date.now(),
      id: 'chatcmpl-final',
      model: 'test',
      object: 'chat.completion',
      system_fingerprint: 'test',
      usage: {
        completion_tokens: 1,
        prompt_tokens: 1,
        total_tokens: 2,
      },
    }), { headers: { 'Content-Type': 'application/json' }, status: 200 })

    chatMock
      .mockResolvedValueOnce(toolCallsResponse)
      .mockResolvedValueOnce(finalResponse)

    const { steps } = await generateText({
      baseURL: 'http://localhost:11434/v1/',
      messages: [{
        content: 'Call both tools',
        role: 'user',
      }],
      model: 'test',
      parallelToolCalls: true,
      tools: [toolA, toolB],
    })

    expect(steps[0].toolCalls.length).toBe(2)
    expect(order.indexOf('b-start')).toBeGreaterThan(-1)
    expect(order.indexOf('a-end')).toBeGreaterThan(-1)
    expect(order.indexOf('b-start')).toBeLessThan(order.indexOf('a-end'))
  })
})
