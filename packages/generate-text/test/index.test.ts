import { ollama } from '@xsai/providers'
import { describe, expect, it } from 'vitest'

import { generateText, type StepResult } from '../src'

describe('@xsai/generate-text', () => {
  it('basic', async () => {
    let step: StepResult | undefined

    const { finishReason, steps, text, toolCalls } = await generateText({
      ...ollama.chat('llama3.2'),
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
      onStepFinish: (result) => {
        step = result
      },
    })

    expect(text).toStrictEqual('YES')
    expect(finishReason).toBe('stop')
    expect(toolCalls.length).toBe(0)
    expect(steps).toMatchSnapshot()

    expect(steps[0]).toStrictEqual(step)
  })

  // TODO: error handling
})
