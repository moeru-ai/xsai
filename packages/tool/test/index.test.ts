import type { JsonSchema } from 'xsschema'

import { description, object, pipe, string } from 'valibot'
import { describe, expect, it } from 'vitest'

import { rawTool, tool } from '../src'

describe('@xsai/tool', () => {
  const name = 'weather'
  const desc = 'Get the weather in a location'

  it('tool', async () => {
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
      additionalProperties: false,
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
  it('rawTool', async () => {
    const parameters = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      additionalProperties: false,
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
    } satisfies JsonSchema

    const weather = rawTool<{ location: string }>({
      description: desc,
      execute: ({ location }) => JSON.stringify({
        location,
        temperature: 42,
      }),
      name,
      parameters,
    })

    expect(weather.type).toBe('function')
    expect(weather.function.name).toBe(name)
    expect(weather.function.description).toBe(desc)
    expect(weather.function.parameters).toStrictEqual(parameters)
  })
})
