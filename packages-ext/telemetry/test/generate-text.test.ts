import type { ReadableSpan } from '@opentelemetry/sdk-trace-base'

import { InMemorySpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node'
import { generateText as aiGenerateText } from 'ai'
import { ollama } from 'ollama-ai-provider-v2'
import { describe, expect, it } from 'vitest'

import { generateText } from '../src'

describe.sequential('generateText', () => {
  const memoryExporter = new InMemorySpanExporter()
  const tracerProvider = new NodeTracerProvider({
    spanProcessors: [new SimpleSpanProcessor(memoryExporter)],
  })
  tracerProvider.register()

  it('basic', async () => {
    const { text } = await generateText({
      baseURL: 'http://localhost:11434/v1',
      messages: [{
        content: 'Why is the sky blue?',
        role: 'user',
      }],
      model: 'qwen3:0.6b',
      seed: 114514,
    })

    const spans = memoryExporter.getFinishedSpans()

    expect(text).toMatchSnapshot()
    expect(spans).toMatchSnapshot()
  })

  it('basic/ai', async () => {
    const { text } = await aiGenerateText({
      experimental_telemetry: { isEnabled: true },
      model: ollama('qwen3:0.6b'),
      prompt: 'Why is the sky blue?',
      seed: 114514,
    })

    const spans = memoryExporter.getFinishedSpans().slice(2)

    expect(text).toMatchSnapshot()
    expect(spans).toMatchSnapshot()
  })

  it('basic/compare', () => {
    const extractAttributes = (span: ReadableSpan) => Object.keys(span.attributes)
      // eslint-disable-next-line sonarjs/no-nested-functions
      .filter(key => ['ai.settings'].every(prefix => !key.startsWith(prefix)))
      .sort((a, b) => a.localeCompare(b))

    const spans = memoryExporter.getFinishedSpans()
    const xsai = spans.slice(0, 2).map(extractAttributes)
    const ai = spans.slice(2).map(extractAttributes)

    xsai.forEach((attributes, i) => {
      expect(attributes).toStrictEqual(ai[i])
    })
  })
})
