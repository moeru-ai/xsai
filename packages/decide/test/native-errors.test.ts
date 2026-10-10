import type { HttpOptions } from '@xsai/shared'
import type { LanguageModel } from '@xsai/text'

import { describe, expect, it, vi } from 'vitest'

import { decisions, systemone, toDecisionModel } from '../src'

const questions = { yes: { instructions: 'Yes?', type: 'boolean' } } as const

describe('native adapter errors', () => {
  // Validation error body from https://api.typesafe.ai/openapi.json; both adapters preserve HTTP error bodies.
  it.each([decisions, systemone])('preserves an upstream validation error without retrying', async (adapter) => {
    const body = '{"detail":[{"loc":["body","state"],"msg":"Field required","type":"missing"}]}'
    const fetch = vi.fn(async () => new Response(body, { headers: { 'content-type': 'application/json' }, status: 422 }))
    await expect(adapter({ baseURL: 'https://example.test', fetch, model: 'decision' })({
      input: '',
      questions,
    })).rejects.toMatchObject({ body, code: 'http-error', status: 422 })
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it.each([decisions, systemone])('preserves the original abort reason', async (adapter) => {
    const controller = new AbortController()
    const reason = new Error('stop')
    const options: HttpOptions = { baseURL: 'https://example.test', fetch: async () => {
      controller.abort(reason)
      throw reason
    }, model: 'decision' }
    await expect(adapter(options)({ input: '', questions, signal: controller.signal })).rejects.toBe(reason)
  })

  it.each([decisions, systemone])('ignores providerOptions belonging to another adapter', async (adapter) => {
    const fetch = vi.fn(async (request: Request) => {
      expect(await request.json()).toEqual(adapter === decisions
        ? { input: 'hello', model: 'decision', questions: [{ instructions: 'Yes?', name: 'yes', type: 'predicate' }] }
        : { model: 'decision', questions: { yes: { instructions: 'Yes?', type: 'noul' } }, state: 'hello' })
      return Response.json({
        answers: adapter === decisions ? [{ name: 'yes', probability: 0.75, type: 'predicate' }] : { yes: { noul: 0.75, type: 'noul' } },
        model: 'decision',
        usage: { input_tokens: 10, output_tokens: 5 },
      })
    })
    const result = await adapter({ baseURL: 'https://example.test', fetch, model: 'decision' })({
      input: 'hello',
      providerOptions: adapter === decisions
        ? { systemone: { images: ['data:image/png;base64,aGVsbG8='] } }
        : { decisions: { overrideInput: 'ignored' } },
      questions,
    })
    expect(result.answers.yes).toEqual({ probability: 0.75, type: 'boolean' })
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('ignores native providerOptions when converting a LanguageModel', async () => {
    const languageModel = vi.fn<LanguageModel>((options) => {
      expect(options.input).toBe('hello')
      expect(options.providerOptions).toBeUndefined()
      return new ReadableStream({ start: (controller) => {
        controller.enqueue({ message: { content: '{"yes":0.75}', role: 'assistant' }, status: 'completed', type: 'step.end' })
        controller.close()
      } })
    })
    const result = await toDecisionModel(languageModel)({ input: 'hello', providerOptions: {
      decisions: { overrideInput: 'ignored' },
      systemone: { images: ['data:image/png;base64,aGVsbG8='] },
    }, questions })
    expect(result.answers.yes).toEqual({ probability: 0.75, type: 'boolean' })
    expect(languageModel).toHaveBeenCalledTimes(1)
  })
})
