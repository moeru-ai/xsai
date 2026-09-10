import type { Message, Tool } from '@xsai/text-primitives'

import { describe, expect, it } from 'vitest'

import { normalizeInput } from '../src/utils/normalize-input'
import { normalizeTools } from '../src/utils/normalize-tools'

describe('normalizeInput', () => {
  it('normalizes a string to a user message', () => {
    expect(normalizeInput('Hello')).toEqual([{
      content: 'Hello',
      role: 'user',
      type: 'message',
    }])
  })

  it('normalizes message content and response items', () => {
    const input: Message[] = [
      {
        content: [{ text: 'Be concise.', type: 'text' }],
        role: 'system',
      },
      {
        content: [
          { data: new URL('https://example.com/image.png'), detail: 'high', type: 'image' },
          { data: new URL('https://example.com/document.pdf'), type: 'file' },
          { data: 'https://example.com/string-document.pdf', type: 'file' },
          { data: 'JVBERi0xLjQ=', type: 'file' },
          { text: 'What is in these files?', type: 'text' },
        ],
        role: 'user',
      },
      {
        content: [
          { arguments: '{"location":"Taipei"}', callId: 'call_1', id: 'fc_1', name: 'weather', type: 'tool-call' },
        ],
        id: 'message_1',
        role: 'assistant',
      },
      {
        content: [{ callId: 'call_1', output: '{"temperature":24}', type: 'tool-result' }],
        role: 'user',
      },
    ]

    expect(normalizeInput(input)).toEqual([
      {
        content: [{ text: 'Be concise.', type: 'input_text' }],
        role: 'system',
        type: 'message',
      },
      {
        content: [
          { detail: 'high', image_url: 'https://example.com/image.png', type: 'input_image' },
          { file_url: 'https://example.com/document.pdf', type: 'input_file' },
          { file_url: 'https://example.com/string-document.pdf', type: 'input_file' },
          { file_data: 'JVBERi0xLjQ=', type: 'input_file' },
          { text: 'What is in these files?', type: 'input_text' },
        ],
        role: 'user',
        type: 'message',
      },
      {
        arguments: '{"location":"Taipei"}',
        call_id: 'call_1',
        id: 'fc_1',
        name: 'weather',
        type: 'function_call',
      },
      {
        call_id: 'call_1',
        output: '{"temperature":24}',
        type: 'function_call_output',
      },
    ])
  })

  it('normalizes reasoning content as a reasoning item', () => {
    expect(normalizeInput([{
      content: [{
        content: [
          { text: 'Summary', type: 'summary' },
          { text: 'opaque', type: 'encrypted' },
        ],
        id: 'reasoning_1',
        type: 'reasoning',
      }],
      role: 'assistant',
    }])).toEqual([{
      encrypted_content: 'opaque',
      id: 'reasoning_1',
      summary: [{ text: 'Summary', type: 'summary_text' }],
      type: 'reasoning',
    }])
  })
})

describe('normalizeTools', () => {
  it('normalizes function tools and preserves the optional description', () => {
    const tools: Tool[] = [
      {
        description: 'Get the weather.',
        inputSchema: {
          additionalProperties: false,
          properties: { location: { type: 'string' } },
          required: ['location'],
          type: 'object',
        },
        name: 'weather',
        outputSchema: {
          properties: { temperature: { type: 'number' } },
          type: 'object',
        },
      },
      {
        inputSchema: { type: 'object' },
        name: 'noop',
      },
    ]

    expect(normalizeTools(tools)).toEqual([
      {
        description: 'Get the weather.',
        name: 'weather',
        parameters: tools[0].inputSchema,
        strict: true,
        type: 'function',
      },
      {
        name: 'noop',
        parameters: tools[1].inputSchema,
        strict: true,
        type: 'function',
      },
    ])
    expect(normalizeTools()).toBeUndefined()
  })
})
