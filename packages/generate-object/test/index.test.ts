import { object as schemaObject, string } from 'valibot'
import { describe, expect, it } from 'vitest'

import { generateObject } from '../src'

describe('@xsai/generate-object', () => {
  it('basic', async () => {
    const { object } = await generateObject({
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
      schema: schemaObject({
        anwser: string(),
      }),
    })

    console.log('object:', object)
    expect(object.anwser).toStrictEqual('YES')
  })
})
