/// <reference types="vite/client" />

import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { VoltAgentExporter } from '@voltagent/vercel-ai-exporter'
import { describe, expect, it } from 'vitest'

import { createTelemetry } from '../src/utils/telemetry'

describe('@xsai-ext/opentelemetry', () => {
  // Setup VoltAgent exporter
  const voltAgentExporter = new VoltAgentExporter({
    baseUrl: 'https://api.voltagent.dev',
    debug: true,
    publicKey: import.meta.env.VOLTAGENT_PUBLIC_KEY as string,
    secretKey: import.meta.env.VOLTAGENT_SECRET_KEY as string,
  })

  // Initialize OpenTelemetry SDK
  const sdk = new NodeSDK({
    instrumentations: [getNodeAutoInstrumentations()],
    // eslint-disable-next-line ts/no-unsafe-assignment
    traceExporter: voltAgentExporter as any,
  })

  sdk.start()

  const t = createTelemetry()

  it('generateText', async () => {
    const { text } = await t.generateText({
      baseURL: 'http://localhost:11434/v1/',
      messages: [
        {
          content: 'You are a helpful assistant.',
          role: 'system',
        },
        {
          content: 'This is a test, so please answer \'YES\' and nothing else.',
          role: 'user',
        },
      ],
      model: 'llama3.2',
    })

    expect(text).toBe('YES')
  }, 30000)
})
