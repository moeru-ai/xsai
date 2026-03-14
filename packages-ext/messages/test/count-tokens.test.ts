import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'

import { countTokens, tool } from '../src'
import { createJSONResponse } from './utils'

describe('@xsai-ext/messages countTokens', async () => {
  it('serializes requests and strips executable tool fields', async () => {
    const lookup = tool({
      description: 'Look up a value',
      execute: ({ key }) => `value for ${key}`,
      inputSchema: z.object({
        key: z.string(),
      }),
      name: 'lookup',
    })

    const fetch = vi.fn<typeof globalThis.fetch>().mockResolvedValue(createJSONResponse({ input_tokens: 42 }))

    await expect(countTokens({
      anthropicBeta: ['tools-2024-04-04'],
      apiKey: 'test-key',
      fetch,
      messages: [{ content: 'Hello', role: 'user' }],
      model: 'claude-sonnet-4-5',
      tools: [lookup],
    })).resolves.toEqual({ input_tokens: 42 })

    expect(fetch).toHaveBeenCalledTimes(1)

    const [url, init] = fetch.mock.calls[0] as [URL, RequestInit]
    expect(url.toString()).toBe('https://api.anthropic.com/v1/messages/count_tokens')
    expect(init.headers).toMatchObject({
      'anthropic-beta': 'tools-2024-04-04',
      'anthropic-version': '2023-06-01',
      'x-api-key': 'test-key',
    })

    const body = JSON.parse(init.body as string) as { tools: Array<Record<string, unknown>> }
    expect(body.tools).toEqual([
      {
        description: 'Look up a value',
        input_schema: {
          $schema: 'http://json-schema.org/draft-07/schema#',
          properties: {
            key: { type: 'string' },
          },
          required: ['key'],
          type: 'object',
        },
        name: 'lookup',
      },
    ])
  })
})
