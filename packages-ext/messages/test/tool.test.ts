import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { tool } from '../src'

describe('@xsai-ext/messages tool helper', async () => {
  it('builds anthropic tool definitions', async () => {
    const weather = tool({
      description: 'Get the weather in a location',
      execute: ({ location }) => `Sunny in ${location}`,
      inputSchema: z.object({
        location: z.string().describe('City name'),
      }),
      name: 'weather',
    })

    expect(weather).toMatchObject({
      description: 'Get the weather in a location',
      input_schema: {
        properties: {
          location: {
            description: 'City name',
            type: 'string',
          },
        },
        required: ['location'],
        type: 'object',
      },
      name: 'weather',
    })

    expect(await weather.execute({ location: 'Shanghai' })).toBe('Sunny in Shanghai')
  })
})
