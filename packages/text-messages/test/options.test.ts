import { describe, expect, it } from 'vitest'

import { messages } from '../src'

const sse = (lines: string[]): Response => {
  const stream = new ReadableStream<string>({
    start: (controller) => {
      for (const line of lines) {
        controller.enqueue(line)
      }
      controller.close()
    },
  })
  return new Response(stream.pipeThrough(new TextEncoderStream()))
}

const capture = (): { bodies: Record<string, unknown>[], fetch: typeof fetch } => {
  const bodies: Record<string, unknown>[] = []
  const mockFetch: typeof fetch = async (_input, init) => {
    bodies.push(JSON.parse(init?.body as string) as Record<string, unknown>)
    return sse(['data: {"type":"message_stop"}\n\n'])
  }
  return { bodies, fetch: mockFetch }
}

describe('messages options', () => {
  it('maps model options to Messages fields', async () => {
    const { bodies, fetch } = capture()
    const model = messages({ baseURL: 'https://x/', fetch, model: 'm' })
    const stream = await model({ input: 'hi' }, {
      maxOutputTokens: 10,
      temperature: 0.5,
      toolChoice: { name: 'get_weather' },
      topP: 0.9,
    })
    await stream.cancel()

    expect(bodies).toHaveLength(1)
    expect(bodies[0]).toMatchObject({
      max_tokens: 10,
      temperature: 0.5,
      tool_choice: { name: 'get_weather', type: 'tool' },
      top_p: 0.9,
    })
  })

  it('maps required toolChoice to any and rejects missing maxOutputTokens', async () => {
    const { bodies, fetch } = capture()
    const model = messages({ baseURL: 'https://x/', fetch, model: 'm' })

    await expect(model({ input: 'hi' })).rejects.toThrow('maxOutputTokens')

    const stream = await model({ input: 'hi' }, { maxOutputTokens: 10, toolChoice: 'required' })
    await stream.cancel()
    expect(bodies[0]).toMatchObject({ tool_choice: { type: 'any' } })
  })
})
