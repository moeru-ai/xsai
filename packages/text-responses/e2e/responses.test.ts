import type { AssistantMessageContent, Event, FinishEvent, Message, TextDeltaEvent, ToolCallPart } from '@xsai/text-primitives'

import { tool } from '@xsai/text-primitives'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { responses } from '../src'

const baseURL = process.env.XSAI_E2E_BASE_URL!
const modelName = process.env.XSAI_E2E_MODEL!

const readEvents = async (stream: ReadableStream<Event>): Promise<Event[]> => {
  const events: Event[] = []
  for await (const event of stream) {
    events.push(event)
  }
  return events
}

describe('responses e2e', () => {
  it('streams a response from the local Ollama Responses API', async () => {
    const model = responses({ baseURL, model: modelName })
    const events = await readEvents(await model({
      input: 'Reply with exactly: e2e-ok',
    }))

    const text = events
      .filter((event): event is TextDeltaEvent => event.type === 'text.delta')
      .map(event => event.delta)
      .join('')

    expect(text.length).toBeGreaterThan(0)
    expect(events.some(event => event.type === 'finish')).toBe(true)
  })

  it('continues a manual tool loop with the finish message', async () => {
    const weatherInput = z.object({
      location: z.string().describe('The city whose weather should be returned.'),
    })
    const toolResult = 'e2e-weather-result-8472'
    const weather = tool({
      description: 'Get the current weather for a city.',
      execute: () => toolResult,
      inputSchema: weatherInput,
      name: 'get_weather',
    })
    const model = responses({ baseURL, model: modelName })
    const input: Message[] = [{
      content: 'Call get_weather once for Taipei. After receiving its result, reply with exactly the tool result.',
      role: 'user',
    }]

    const firstEvents = await readEvents(await model({ input, tools: [weather] }))
    const firstFinish = firstEvents.find((event): event is FinishEvent => event.type === 'finish')!
    const toolCall = (firstFinish.message.content as readonly AssistantMessageContent[])
      .find((part): part is ToolCallPart => part.type === 'tool-call')!
    const result = await weather.execute(weatherInput.parse(JSON.parse(toolCall.arguments)))

    expect(toolCall.name).toBe(weather.name)

    input.push(firstFinish.message, {
      content: [{ callId: toolCall.callId, output: result, type: 'tool-result' }],
      role: 'user',
    })

    const secondEvents = await readEvents(await model({ input }))
    const text = secondEvents
      .filter((event): event is TextDeltaEvent => event.type === 'text.delta')
      .map(event => event.delta)
      .join('')

    expect(text).toContain(toolResult)
    expect(secondEvents.some(event => event.type === 'finish')).toBe(true)
  })
})
