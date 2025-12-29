import { LangfuseSpanProcessor } from '@langfuse/otel'
import { InMemorySpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node'
import { describe, expect, it } from 'vitest'

import { streamText } from '../src'
import { cleanAttributes } from './fixtures/clean-attributes'

describe.sequential('streamText', () => {
  const memoryExporter = new InMemorySpanExporter()
  const tracerProvider = new NodeTracerProvider({
    spanProcessors: [
      new SimpleSpanProcessor(memoryExporter),
      new LangfuseSpanProcessor(),
    ],
  })
  tracerProvider.register()

  it('basic', async () => {
    let text = ''

    const { textStream } = streamText({
      baseURL: 'http://localhost:11434/v1',
      messages: [{
        content: 'This is a test, so please answer \'YES\' and nothing else.',
        role: 'user',
      }],
      model: 'granite4:1b-h',
      onFinish: async () => {
        const spans = memoryExporter.getFinishedSpans()
        const names = spans.map(s => s.name)
        const attributes = spans.map(s => cleanAttributes(s.attributes))

        expect(text).toMatchSnapshot()
        expect(names).toMatchSnapshot()
        expect(attributes).toMatchSnapshot()
      },
      seed: 114514,
      streamOptions: {
        includeUsage: true,
      },
    })

    for await (const textDelta of textStream) {
      text += textDelta
    }
  }, 120_000)
})
