import { XSAIError } from '@xsai/text-primitives/shared'
import { describe, expect, it } from 'vitest'

import { normalizeInput } from '../src/utils/normalize-input'

describe('normalize input', () => {
  it('hoists instructions and system/developer messages into the system param', () => {
    expect(normalizeInput({
      input: [
        { content: 'be brief', role: 'system' },
        { content: 'hi', role: 'user' },
        { content: [{ text: 'dev note', type: 'text' }], role: 'developer' },
      ],
      instructions: 'instructions',
    })).toEqual({
      messages: [{ content: [{ text: 'hi', type: 'text' }], role: 'user' }],
      system: [
        { text: 'instructions', type: 'text' },
        { text: 'be brief', type: 'text' },
        { text: 'dev note', type: 'text' },
      ],
    })
  })

  it('maps tool calls and results to tool_use/tool_result blocks', () => {
    expect(normalizeInput({
      input: [
        { content: 'weather?', role: 'user' },
        {
          content: [{
            arguments: '{"city":"Taipei"}',
            callId: 'toolu_1',
            id: 'toolu_1',
            name: 'weather',
            type: 'tool-call',
          }],
          role: 'assistant',
        },
        {
          content: [{ callId: 'toolu_1', isError: true, output: 'boom', type: 'tool-result' }],
          role: 'user',
        },
      ],
    })).toEqual({
      messages: [
        { content: [{ text: 'weather?', type: 'text' }], role: 'user' },
        {
          content: [{
            id: 'toolu_1',
            input: { city: 'Taipei' },
            name: 'weather',
            type: 'tool_use',
          }],
          role: 'assistant',
        },
        {
          content: [{
            content: 'boom',
            is_error: true,
            tool_use_id: 'toolu_1',
            type: 'tool_result',
          }],
          role: 'user',
        },
      ],
    })
  })

  it('replays reasoning parts as thinking/redacted_thinking blocks', () => {
    expect(normalizeInput({
      input: [{
        content: [{
          content: [
            { text: 'Think', type: 'text' },
            { data: 'redacted-data', type: 'redacted' },
            { text: 'summary text', type: 'summary' },
            { text: 'encrypted-data', type: 'encrypted' },
          ],
          metadata: { messages: { signature: 'sig_1' } },
          type: 'reasoning',
        }],
        role: 'assistant',
      }],
    })).toEqual({
      messages: [{
        content: [
          { signature: 'sig_1', thinking: 'Think', type: 'thinking' },
          { data: 'redacted-data', type: 'redacted_thinking' },
          { data: 'encrypted-data', type: 'redacted_thinking' },
        ],
        role: 'assistant',
      }],
    })
  })

  it('maps image parts to url or base64 sources', () => {
    expect(normalizeInput({
      input: [{
        content: [
          { data: 'https://example.com/cat.png', type: 'image' },
          { data: 'data:image/png;base64,aGVsbG8=', type: 'image' },
        ],
        role: 'user',
      }],
    })).toEqual({
      messages: [{
        content: [
          { source: { type: 'url', url: 'https://example.com/cat.png' }, type: 'image' },
          { source: { data: 'aGVsbG8=', media_type: 'image/png', type: 'base64' }, type: 'image' },
        ],
        role: 'user',
      }],
    })
  })

  it('rejects refusal parts with an invalid-input error', () => {
    const call = () => normalizeInput({
      input: [{ content: [{ refusal: 'I cannot help', type: 'refusal' }], role: 'assistant' }],
    })

    expect(call).toThrow(XSAIError)
    expect(call).toThrow(expect.objectContaining({
      code: 'invalid-input',
      message: 'Refusal parts cannot be replayed on the Messages API',
    }))
  })

  it('rejects non-PDF document data with an invalid-input error', () => {
    const call = () => normalizeInput({
      input: [{ content: [{ data: 'data:image/png;base64,aGVsbG8=', type: 'file' }], role: 'user' }],
    })

    expect(call).toThrow(XSAIError)
    expect(call).toThrow(expect.objectContaining({
      code: 'invalid-input',
      message: 'Anthropic documents only support PDF or plain text, got: image/png',
    }))
  })
})
