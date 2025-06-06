/// <reference types="vite/client" />

import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'
import * as v from 'valibot'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { generateText, tool } from 'xsai'

import { createTelemetry } from '../src/utils/telemetry'

diag.setLogger(new DiagConsoleLogger(), { logLevel: DiagLogLevel.ALL })

describe('@xsai-ext/opentelemetry', async () => {
  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: 'xsai',
    }),
    traceExporter: new OTLPTraceExporter({
      url: 'http://localhost:4318/v1/traces',
    }),
  })

  beforeAll(() => {
    sdk.start()
  })

  it('generateText', async () => {
    const weather = await tool({
      description: 'Get the weather in a location',
      execute: ({ location }) => JSON.stringify({
        location,
        temperature: 22,
      }),
      name: 'weather',
      parameters: v.object({
        location: v.pipe(
          v.string(),
          v.description('The location to get the weather for'),
        ),
      }),
    })

    const { text } = await generateText({
      ...createTelemetry(),
      baseURL: 'http://localhost:11434/v1/',
      messages: [
        {
          content: 'You are a helpful assistant.',
          role: 'system',
        },
        {
          content: 'What is the weather in Tokyo?',
          role: 'user',
        },
      ],
      model: 'qwen3:4b',
      tools: [weather],
    })

    expect(text).toBeDefined() // TODO: Later
  }, 30000)

  afterAll(async () => {
    await sdk.shutdown()
  })
})
