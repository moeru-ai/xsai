import type { HttpOptions } from '@xsai/shared'

import type { AssistantMessageContent, ExecutableTool, LanguageModel, Message, StreamEndEvent, TextDeltaEvent, TextEvent, ToolCallDeltaEvent, ToolCallPart } from '../src'

import { env } from 'node:process'

import { expect } from 'vitest'

const sse = (lines: string[]): Response => {
  const stream = new ReadableStream<string>({
    start: (controller) => {
      for (const line of lines)
        controller.enqueue(line)
      controller.close()
    },
  })
  return new Response(stream.pipeThrough(new TextEncoderStream()))
}

export const captureRequests = (terminalData = '[DONE]'): { bodies: Record<string, unknown>[], fetch: typeof fetch } => {
  const bodies: Record<string, unknown>[] = []
  const mockFetch: typeof fetch = async (_input, init) => {
    bodies.push(JSON.parse(init?.body as string) as Record<string, unknown>)
    return sse([`data: ${terminalData}\n\n`])
  }
  return { bodies, fetch: mockFetch }
}

const readEvents = async (stream: ReadableStream<TextEvent>): Promise<TextEvent[]> => {
  const events: TextEvent[] = []
  for await (const event of stream)
    events.push(event)
  return events
}

const parseWeatherInput = (input: unknown): { location: string } => {
  if (typeof input !== 'object' || input === null || !('location' in input) || typeof input.location !== 'string')
    throw new TypeError('Expected tool input to contain a string location')
  return { location: input.location }
}

export const languageModelE2ECases = (createModel: (options: HttpOptions) => LanguageModel) => {
  const baseURL = env.XSAI_E2E_BASE_URL!
  const modelName = env.XSAI_E2E_MODEL!

  const streamsResponse = async (): Promise<void> => {
    const model = createModel({ baseURL, model: modelName })
    const events = await readEvents(await model({
      input: 'Reply with exactly: e2e-ok',
    }))

    const text = events
      .filter((event): event is TextDeltaEvent => event.type === 'text.delta')
      .map(event => event.delta)
      .join('')

    expect(text.length).toBeGreaterThan(0)
    expect(events.some(event => event.type === 'stream.end')).toBe(true)
  }

  const continuesManualToolLoop = async (): Promise<void> => {
    const toolResult = 'e2e-weather-result-8472'
    const weather: ExecutableTool = {
      description: 'Get the current weather for a city.',
      execute: () => toolResult,
      inputSchema: {
        schema: {
          properties: { location: { description: 'The city whose weather should be returned.', type: 'string' } },
          required: ['location'],
          type: 'object',
        },
      },
      name: 'get_weather',
    }
    const model = createModel({ baseURL, model: modelName })
    const input: Message[] = [{
      content: 'Call get_weather once for Taipei. After receiving its result, reply with exactly the tool result.',
      role: 'user',
    }]

    const firstEvents = await readEvents(await model({ input, tools: [weather] }))
    const firstStreamEnd = firstEvents.find((event): event is StreamEndEvent => event.type === 'stream.end')!
    const firstContent = firstStreamEnd.message.content as readonly AssistantMessageContent[]
    const toolCallIndex = firstContent.findIndex(part => part.type === 'tool-call')
    const toolCall = firstContent.find((part): part is ToolCallPart => part.type === 'tool-call')!
    const toolCallDeltas = firstEvents.filter((event): event is ToolCallDeltaEvent =>
      event.type === 'tool-call.delta' && event.index === toolCallIndex)

    expect(toolCallDeltas.length).toBeGreaterThan(0)
    expect(toolCallDeltas.every(event => event.id === toolCall.callId)).toBe(true)
    const result = await weather.execute(parseWeatherInput(JSON.parse(toolCall.arguments)))

    expect(toolCall.name).toBe(weather.name)

    input.push(firstStreamEnd.message, {
      content: [{ callId: toolCall.callId, output: result, type: 'tool-result' }],
      role: 'user',
    })

    const secondEvents = await readEvents(await model({ input }))
    const text = secondEvents
      .filter((event): event is TextDeltaEvent => event.type === 'text.delta')
      .map(event => event.delta)
      .join('')

    expect(text).toContain(toolResult)
    expect(secondEvents.some(event => event.type === 'stream.end')).toBe(true)
  }

  return { continuesManualToolLoop, streamsResponse }
}
