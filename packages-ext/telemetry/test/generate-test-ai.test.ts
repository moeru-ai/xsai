import { InMemorySpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node'
import { generateText } from 'ai'
import { config } from 'dotenv'
import { ollama } from 'ollama-ai-provider-v2'
import { describe, expect, it } from 'vitest'

config()

describe('ai/generateText', () => {
  it('basic', async () => {
    const memoryExporter = new InMemorySpanExporter()
    const tracerProvider = new NodeTracerProvider({
      spanProcessors: [new SimpleSpanProcessor(memoryExporter)],
    })
    tracerProvider.register()

    const { text } = await generateText({
      experimental_telemetry: { isEnabled: true },
      model: ollama('qwen3:0.6b'),
      prompt: 'Why is the sky blue?',
      seed: 114514,
    })

    const spans = memoryExporter.getFinishedSpans()

    expect(text).toMatchSnapshot()
    expect(spans).toMatchSnapshot()
  })
})
