import type { JSONSchema7 } from '@xsai/text-primitives/internal'

import { tool, XSAIError } from '@xsai/text-primitives'
import { describe, expect, it } from 'vitest'

import { captureRequests } from '../../text-primitives/test/test-utils'
import { messages } from '../src'

describe('messages options', () => {
  it('sends provider tools, beta headers, and MCP servers with local tools', async () => {
    let requestBody: Record<string, unknown> | undefined
    let requestHeaders: Headers | undefined
    const requestFetch: typeof fetch = async (_input, init) => {
      requestBody = JSON.parse(init?.body as string) as Record<string, unknown>
      requestHeaders = new Headers(init?.headers)
      return new Response('data: {"type":"message_stop"}\n\n')
    }
    const model = messages({ baseURL: 'https://x/', fetch: requestFetch, model: 'm' })
    const stream = await model({
      input: 'hi',
      maxOutputTokens: 10,
      providerOptions: {
        messages: {
          betas: ['mcp-client-2025-11-20'],
          mcpServers: [{ name: 'docs', type: 'url', url: 'https://mcp.example.com' }],
          tools: [
            { max_uses: 3, name: 'web_search', type: 'web_search_20250305' },
            { mcp_server_name: 'docs', type: 'mcp_toolset' },
          ],
        },
      },
      tools: [tool({ inputSchema: { type: 'object' }, name: 'local_tool' })],
    })
    await stream.cancel()

    expect(requestHeaders?.get('anthropic-beta')).toBe('mcp-client-2025-11-20')
    expect(requestBody).not.toHaveProperty('providerOptions')
    expect(requestBody?.mcp_servers).toEqual([{ name: 'docs', type: 'url', url: 'https://mcp.example.com' }])
    expect(requestBody?.tools).toEqual([
      { max_uses: 3, name: 'web_search', type: 'web_search_20250305' },
      { mcp_server_name: 'docs', type: 'mcp_toolset' },
      {
        input_schema: { additionalProperties: false, properties: {}, type: 'object' },
        name: 'local_tool',
      },
    ])
  })

  it('maps model options to Messages fields', async () => {
    const { bodies, fetch } = captureRequests('{"type":"message_stop"}')
    const model = messages({ baseURL: 'https://x/', fetch, model: 'm' })
    const stream = await model({
      input: 'hi',
      maxOutputTokens: 10,
      reasoningEffort: 'max',
      temperature: 0.5,
      toolChoice: { name: 'get_weather' },
      topP: 0.9,
    })
    await stream.cancel()

    expect(bodies).toHaveLength(1)
    expect(bodies[0]).toMatchObject({
      max_tokens: 10,
      output_config: { effort: 'max' },
      temperature: 0.5,
      tool_choice: { name: 'get_weather', type: 'tool' },
      top_p: 0.9,
    })
    expect(bodies[0]).not.toHaveProperty('effort')
  })

  it('maps required toolChoice to any and rejects missing maxOutputTokens', async () => {
    const { bodies, fetch } = captureRequests('{"type":"message_stop"}')
    const model = messages({ baseURL: 'https://x/', fetch, model: 'm' })

    await expect(model({ input: 'hi' })).rejects.toThrow(XSAIError)
    await expect(model({ input: 'hi' })).rejects.toMatchObject({
      code: 'invalid-input',
      message: 'maxOutputTokens is required for the Messages API',
    })

    const stream = await model({ input: 'hi', maxOutputTokens: 10, toolChoice: 'required' })
    await stream.cancel()
    expect(bodies[0]).toMatchObject({ tool_choice: { type: 'any' } })
  })

  it('maps outputFormat to output_config.format and merges with effort', async () => {
    const { bodies, fetch } = captureRequests('{"type":"message_stop"}')
    const model = messages({ baseURL: 'https://x/', fetch, model: 'm' })
    const stream = await model({
      input: 'hi',
      maxOutputTokens: 10,
      outputFormat: {
        properties: {
          amount: { maximum: 10, minimum: 0, type: 'number' },
          optional: { type: 'string' },
        },
        required: ['amount'],
        title: 'answer',
        type: 'object',
      },
      reasoningEffort: 'high',
    })
    await stream.cancel()

    expect(bodies[0].output_config).toMatchObject({
      effort: 'high',
      format: {
        schema: {
          additionalProperties: false,
          properties: {
            amount: { type: 'number' },
            optional: { type: 'string' },
          },
          required: ['amount'],
        },
        type: 'json_schema',
      },
    })
  })

  it('normalizes tool schemas with Messages constraints', async () => {
    const { bodies, fetch } = captureRequests('{"type":"message_stop"}')
    const model = messages({ baseURL: 'https://x/', fetch, model: 'm' })
    const schema: JSONSchema7 = {
      properties: {
        amount: { maximum: 10, minimum: 0, type: 'number' },
        list: { items: { type: 'string' }, maxItems: 3, minItems: 2, type: 'array' },
        optional: { type: 'string' },
      },
      required: ['amount'],
      type: 'object',
    }

    const stream = await model({
      input: 'hi',
      maxOutputTokens: 10,
      tools: [tool({ inputSchema: schema, name: 'measure' })],
    })
    await stream.cancel()

    expect(bodies[0].tools).toEqual([{
      description: undefined,
      input_schema: {
        additionalProperties: false,
        properties: {
          amount: { type: 'number' },
          list: { items: { type: 'string' }, type: 'array' },
          optional: { type: 'string' },
        },
        required: ['amount'],
        type: 'object',
      },
      name: 'measure',
    }])
    expect(schema).toEqual({
      properties: {
        amount: { maximum: 10, minimum: 0, type: 'number' },
        list: { items: { type: 'string' }, maxItems: 3, minItems: 2, type: 'array' },
        optional: { type: 'string' },
      },
      required: ['amount'],
      type: 'object',
    })
  })

  it('preserves an x-api-key supplied through headers', async () => {
    let requestHeaders: Headers | undefined
    const requestFetch: typeof fetch = async (_input, init) => {
      requestHeaders = new Headers(init?.headers)
      return new Response('data: {"type":"message_stop"}\n\n')
    }
    const model = messages({
      baseURL: 'https://x/',
      fetch: requestFetch,
      headers: { 'x-api-key': 'custom-key' },
      model: 'm',
    })

    const stream = await model({ input: 'hi', maxOutputTokens: 10 })
    await stream.cancel()

    expect(requestHeaders?.get('x-api-key')).toBe('custom-key')
  })
})
