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
          {
            arguments: '{"location":"Taipei"}',
            callId: 'call_1',
            id: 'fc_1',
            name: 'weather',
            type: 'tool-call',
          },
        ],
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

  it('replays refusal parts as refusal content', () => {
    expect(normalizeInput([{
      content: [
        { refusal: 'I cannot help', type: 'refusal' },
        { text: 'partial', type: 'text' },
      ],
      id: 'msg_1',
      role: 'assistant',
    }])).toEqual([
      {
        content: [
          { refusal: 'I cannot help', type: 'refusal' },
          { text: 'partial', type: 'output_text' },
        ],
        id: 'msg_1',
        role: 'assistant',
        type: 'message',
      },
    ])
  })

  it('sends inline data URLs as file data', () => {
    expect(normalizeInput([{
      content: [{ data: 'data:application/pdf;base64,JVBERi0xLjQ=', type: 'file' }],
      role: 'user',
    }])).toEqual([{
      content: [{ file_data: 'data:application/pdf;base64,JVBERi0xLjQ=', type: 'input_file' }],
      role: 'user',
      type: 'message',
    }])
  })

  it('sends only remote URLs as file URLs', () => {
    expect(normalizeInput([{
      content: [
        { data: 'DATA:application/pdf;base64,JVBERi0xLjQ=', type: 'file' },
        { data: 'file:///tmp/document.pdf', type: 'file' },
      ],
      role: 'user',
    }])).toEqual([{
      content: [
        { file_data: 'DATA:application/pdf;base64,JVBERi0xLjQ=', type: 'input_file' },
        { file_data: 'file:///tmp/document.pdf', type: 'input_file' },
      ],
      role: 'user',
      type: 'message',
    }])
  })

  it('normalizes rich tool result content', () => {
    expect(normalizeInput([{
      content: [{
        callId: 'call_1',
        output: [
          { data: new URL('https://example.com/result.png'), detail: 'low', type: 'image' },
          { text: '{"temperature":24}', type: 'text' },
        ],
        type: 'tool-result',
      }],
      role: 'user',
    }])).toEqual([{
      call_id: 'call_1',
      output: [
        { detail: 'low', image_url: 'https://example.com/result.png', type: 'input_image' },
        { text: '{"temperature":24}', type: 'input_text' },
      ],
      type: 'function_call_output',
    }])
  })

  it('preserves a single text tool result block as an array', () => {
    expect(normalizeInput([{
      content: [{
        callId: 'call_1',
        output: [{ text: 'done', type: 'text' }],
        type: 'tool-result',
      }],
      role: 'user',
    }])).toEqual([{
      call_id: 'call_1',
      output: [{ text: 'done', type: 'input_text' }],
      type: 'function_call_output',
    }])
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

  it('preserves assistant output order', () => {
    expect(normalizeInput([{
      content: [
        { text: 'answer', type: 'text' },
        {
          content: [
            { text: 'summary', type: 'summary' },
            { text: 'private thought', type: 'text' },
            { data: 'redacted thought', type: 'redacted' },
          ],
          id: 'reasoning_1',
          type: 'reasoning',
        },
        {
          arguments: '{}',
          callId: 'call_1',
          id: 'fc_1',
          name: 'lookup',
          type: 'tool-call',
        },
      ],
      id: 'message_1',
      role: 'assistant',
    }])).toEqual([
      {
        content: [{ text: 'answer', type: 'output_text' }],
        id: 'message_1',
        role: 'assistant',
        type: 'message',
      },
      {
        encrypted_content: 'redacted thought',
        id: 'reasoning_1',
        summary: [{ text: 'summary', type: 'summary_text' }],
        type: 'reasoning',
      },
      {
        arguments: '{}',
        call_id: 'call_1',
        id: 'fc_1',
        name: 'lookup',
        type: 'function_call',
      },
    ])
  })

  it('preserves reasoning without an id', () => {
    expect(normalizeInput([{
      content: [
        { content: [{ text: 'unreplayable', type: 'text' }], type: 'reasoning' },
        { text: 'answer', type: 'text' },
      ],
      role: 'assistant',
    }])).toEqual([
      {
        summary: [],
        type: 'reasoning',
      },
      {
        content: [{ text: 'answer', type: 'output_text' }],
        role: 'assistant',
        type: 'message',
      },
    ])
  })

  it('preserves function-call item ids', () => {
    expect(normalizeInput([{
      content: [{
        arguments: '{}',
        callId: 'call_1',
        id: 'local-call-id',
        name: 'lookup',
        type: 'tool-call',
      }],
      role: 'assistant',
    }])).toEqual([{
      arguments: '{}',
      call_id: 'call_1',
      id: 'local-call-id',
      name: 'lookup',
      type: 'function_call',
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
        parameters: {
          additionalProperties: false,
          properties: {},
          required: [],
          type: 'object',
        },
        strict: true,
        type: 'function',
      },
    ])
    expect(normalizeTools()).toBeUndefined()
  })
})
