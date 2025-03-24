import { description, number, object, pipe, string } from 'valibot'
import { describe, expect, it } from 'vitest'

import { tool } from '../src'

describe('@xsai/tool', () => {
  it('weather', async () => {
    const name = 'weather'
    const desc = 'Get the weather in a location'

    const weather = await tool({
      description: desc,
      execute: ({ location }) => JSON.stringify({
        location,
        temperature: 42,
      }),
      name,
      parameters: object({
        location: pipe(
          string(),
          description('The location to get the weather for'),
        ),
      }),
    })

    expect(weather.type).toBe('function')
    expect(weather.function.name).toBe(name)
    expect(weather.function.description).toBe(desc)
    expect(weather.function.parameters).toStrictEqual({
      $schema: 'http://json-schema.org/draft-07/schema#',
      properties: {
        location: {
          description: 'The location to get the weather for',
          type: 'string',
        },
      },
      required: [
        'location',
      ],
      type: 'object',
    })
  })

  it('weather with returns', async () => {
    const name = 'weather'
    const desc = 'Get the weather in a location'

    const weather = await tool({
      description: desc,
      execute: ({ location }) => ({
        location,
        temperature: 42,
      }),
      name,
      parameters: object({
        location: pipe(
          string(),
          description('The location to get the weather for'),
        ),
      }),
      returns: object({
        location: pipe(
          string(),
          description('The location to get the weather for'),
        ),
        temperature: number(),
      }),
    })

    expect(weather.type).toBe('function')
    expect(weather.function.name).toBe(name)
    expect(weather.function.description).toBe(desc)
    expect(weather.function.parameters).toStrictEqual({
      $schema: 'http://json-schema.org/draft-07/schema#',
      properties: {
        location: {
          description: 'The location to get the weather for',
          type: 'string',
        },
      },
      required: [
        'location',
      ],
      type: 'object',
    })
    expect(weather.function.returns).toStrictEqual({
      $schema: 'http://json-schema.org/draft-07/schema#',
      properties: {
        location: {
          description: 'The location to get the weather for',
          type: 'string',
        },
        temperature: {
          type: 'number',
        },
      },
      required: [
        'location',
        'temperature',
      ],
      type: 'object',
    })
  })
})
