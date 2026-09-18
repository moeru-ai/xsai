import { XSAIError } from '@xsai/text-primitives/shared'
import { describe, expect, it } from 'vitest'

import { normalizeInput } from '../src/utils/normalize-input'

describe('normalize input', () => {
  it('keeps system/developer roles and prepends instructions as a system message', () => {
    expect(normalizeInput({
      input: [
        { content: 'be brief', role: 'system' },
        { content: 'hi', role: 'user' },
        { content: [{ text: 'dev note', type: 'text' }], role: 'developer' },
      ],
      instructions: 'instructions',
    })).toEqual([
      { content: 'instructions', role: 'system' },
      { content: 'be brief', role: 'system' },
      { content: 'hi', role: 'user' },
      { content: 'dev note', role: 'developer' },
    ])
  })

  it('replays refusal parts to the refusal field', () => {
    expect(normalizeInput({
      input: [
        {
          content: [
            { refusal: 'I cannot help', type: 'refusal' },
            { text: 'hi', type: 'text' },
          ],
          role: 'assistant',
        },
      ],
    })).toEqual([
      {
        content: [{ text: 'hi', type: 'text' }],
        refusal: 'I cannot help',
        role: 'assistant',
      },
    ])
  })

  it('splits tool-result parts into tool role messages', () => {
    expect(normalizeInput({
      input: [
        { content: 'weather?', role: 'user' },
        {
          content: [{
            arguments: '{"city":"Taipei"}',
            callId: 'call_1',
            id: 'call_1',
            name: 'get_weather',
            type: 'tool-call',
          }],
          role: 'assistant',
        },
        {
          content: [
            { callId: 'call_1', output: 'sunny', type: 'tool-result' },
            { text: 'thanks', type: 'text' },
          ],
          role: 'user',
        },
      ],
    })).toEqual([
      { content: 'weather?', role: 'user' },
      {
        content: '',
        role: 'assistant',
        tool_calls: [{
          function: { arguments: '{"city":"Taipei"}', name: 'get_weather' },
          id: 'call_1',
          type: 'function',
        }],
      },
      { content: 'sunny', role: 'tool', tool_call_id: 'call_1' },
      { content: [{ text: 'thanks', type: 'text' }], role: 'user' },
    ])
  })

  it('never sends empty tool output', () => {
    expect(normalizeInput({
      input: [{
        content: [{ callId: 'call_1', output: '', type: 'tool-result' }],
        role: 'user',
      }],
    })).toEqual([
      { content: '(no output)', role: 'tool', tool_call_id: 'call_1' },
    ])
  })

  it('replays reasoning under the captured field name', () => {
    expect(normalizeInput({
      input: [{
        content: [
          {
            content: [
              { text: 'Think', type: 'text' },
              { text: 'redacted-data', type: 'redacted' },
            ],
            metadata: { chat: { reasoning_field: 'reasoning' } },
            type: 'reasoning',
          },
          { text: 'Done', type: 'text' },
        ],
        role: 'assistant',
      }],
    })).toEqual([{
      content: [{ text: 'Done', type: 'text' }],
      reasoning: 'Think',
      role: 'assistant',
    }])

    expect(normalizeInput({
      input: [{
        content: [{ content: [{ text: 'Think', type: 'text' }], type: 'reasoning' }],
        role: 'assistant',
      }],
    })).toEqual([{
      content: '',
      reasoning_content: 'Think',
      role: 'assistant',
    }])
  })

  it('maps image parts to image_url blocks', () => {
    expect(normalizeInput({
      input: [{
        content: [
          { data: 'https://example.com/cat.png', type: 'image' },
          { data: 'data:image/png;base64,aGVsbG8=', type: 'image' },
        ],
        role: 'user',
      }],
    })).toEqual([{
      content: [
        { image_url: { url: 'https://example.com/cat.png' }, type: 'image_url' },
        { image_url: { url: 'data:image/png;base64,aGVsbG8=' }, type: 'image_url' },
      ],
      role: 'user',
    }])
  })

  it('rejects non-URL image data with an invalid-input error', () => {
    const call = () => normalizeInput({
      input: [{ content: [{ data: 'not a url', type: 'image' }], role: 'user' }],
    })

    expect(call).toThrow(XSAIError)
    expect(call).toThrow(expect.objectContaining({
      code: 'invalid-input',
      message: 'Image part data must be a URL or a base64 data: URL',
    }))
  })
})
