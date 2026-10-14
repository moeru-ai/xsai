import type { StepEndEvent, TextEvent } from '@xsai/text'

import { describe, expect, it } from 'vitest'

import { responses } from '../src'

const readEvents = async (wireEvents: unknown[]): Promise<TextEvent[]> => {
  const model = responses({
    baseURL: 'https://example.com/backend-api/codex/',
    fetch: async () => new Response(wireEvents.map(event => `data: ${JSON.stringify(event)}\n\n`).join('')),
    model: 'test-model',
  })
  const events: TextEvent[] = []
  for await (const event of await model({ includeRawEvents: true, input: 'hi' }))
    events.push(event)
  return events
}

const item = {
  content: [{ annotations: [], text: 'Hello', type: 'output_text' }],
  id: 'msg_1',
  role: 'assistant',
  status: 'completed',
  type: 'message',
}

describe('chatGPT response.done', () => {
  // Completed payload matches pi-ai's MockWebSocket fixture; other statuses are synthetic variants.
  // https://github.com/earendil-works/pi/blob/2688aba7dc177020ef5da5492a966ed28ad619bd/packages/ai/test/openai-codex-stream.test.ts#L1385
  it.each(['completed', 'incomplete', 'failed', 'cancelled', undefined])('preserves streamed content and usage for status %s without output', async (status) => {
    const error = { code: 'server_error', message: 'something went wrong' }
    const wireEvents = [
      { item, output_index: 0, type: 'response.output_item.done' },
      {
        response: {
          ...(status == null ? {} : { status }),
          ...(status === 'failed' ? { error } : {}),
          ...(status === 'incomplete' ? { incomplete_details: { reason: 'max_output_tokens' } } : {}),
          end_turn: false,
          usage: {
            input_tokens: 5,
            input_tokens_details: { cached_tokens: 0 },
            output_tokens: 3,
            total_tokens: 8,
          },
        },
        type: 'response.done',
      },
    ]
    const events = await readEvents(wireEvents)
    expect(events.filter(event => event.type === 'raw').map(event => event.detail)).toEqual(wireEvents)
    const terminal = events.filter((event): event is StepEndEvent => event.type === 'step.end')
    expect(terminal).toHaveLength(1)
    expect(terminal[0]).toMatchObject({
      message: { content: [{ text: 'Hello', type: 'text' }], id: 'msg_1', role: 'assistant' },
      status: status ?? 'completed',
      usage: { cacheReadInputTokens: 0, inputTokens: 5, outputTokens: 3, totalTokens: 8 },
    })
    if (status === 'failed') {
      expect(terminal[0].error).toMatchObject({ cause: error, code: 'model-error', message: error.message })
    }
    else {
      expect(terminal[0]).not.toHaveProperty('error')
    }
    expect(terminal[0].reason).toBe(status === 'incomplete' ? 'length' : undefined)
  })

  it.each([
    { output: [] },
    { output: [{ ...item, content: [{ annotations: [], text: 'Final answer', type: 'output_text' }] }] },
  ])('uses the final output snapshot $output when present', async ({ output }) => {
    const events = await readEvents([
      { item, output_index: 0, type: 'response.output_item.done' },
      { response: { output, status: 'completed' }, type: 'response.done' },
    ])
    expect(events.at(-1)).toMatchObject({
      message: { content: output.length === 0 ? [] : [{ text: 'Final answer', type: 'text' }], role: 'assistant' },
      status: 'completed',
      type: 'step.end',
    })
  })

  it('rejects unknown explicit statuses', async () => {
    await expect(readEvents([
      { response: { output: [], status: 'future_status' }, type: 'response.done' },
    ])).rejects.toMatchObject({
      cause: { message: 'unknown response status: future_status' },
      code: 'protocol-error',
    })
  })

  it('still rejects a stream without a terminal event', async () => {
    await expect(readEvents([
      { item, output_index: 0, type: 'response.output_item.done' },
    ])).rejects.toMatchObject({ code: 'truncated-stream' })
  })
})
