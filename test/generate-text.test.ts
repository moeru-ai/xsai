import { describe, expect, it } from 'vitest'

import { generateText } from '../src'

describe('generateText', () => {
  it('basic', async () => {
    const { text } = await generateText({
      model: 'llama3.2',
      prompt: 'This is a test, so please answer \'YES\' and nothing else.',
    })

    expect(text).toStrictEqual('YES')
  })
})
