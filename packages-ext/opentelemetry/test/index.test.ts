import { describe, expect, it } from 'vitest'

import { createTelemetry } from '../src/utils/telemetry'

describe('@xsai-ext/opentelemetry', () => {
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
