import { describe, expect, it } from 'vitest'

import { responses } from '../src'

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
    return sse(['data: [DONE]\n\n'])
  }
  return { bodies, fetch: mockFetch }
}

describe('responses options', () => {
  it('maps model options to Responses fields', async () => {
    const { bodies, fetch } = capture()
    const model = responses({ baseURL: 'https://x/', fetch, model: 'm' })
    const stream = await model({ input: 'hi' }, {
      extraBody: { reasoning: { summary: 'detailed' } },
      maxOutputTokens: 10,
      reasoningEffort: 'high',
      temperature: 0.5,
      toolChoice: { name: 'get_weather' },
      topP: 0.9,
    })
    await stream.cancel()

    expect(bodies).toHaveLength(1)
    expect(bodies[0]).toMatchObject({
      max_output_tokens: 10,
      reasoning: { effort: 'high', summary: 'detailed' },
      temperature: 0.5,
      tool_choice: { name: 'get_weather', type: 'function' },
      top_p: 0.9,
    })
  })
})
