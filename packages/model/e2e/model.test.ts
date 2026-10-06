import { env } from 'node:process'

import { describe, expect, it } from 'vitest'

import { listModels, models, retrieveModel } from '../src'

const baseURL = env.XSAI_E2E_BASE_URL!
const modelIds = [env.XSAI_E2E_MODEL!, env.XSAI_E2E_MODEL_EMBED!]
const model = models({ baseURL })

describe('model e2e', () => {
  it('lists the configured Ollama text and embedding models', async () => {
    const result = await listModels(model)

    for (const id of modelIds)
      expect(result.some(model => model.id === id), `expected Ollama to list ${id}`).toBe(true)
  })

  it.each(modelIds)('retrieves the Ollama model %s', async (id) => {
    const result = await retrieveModel(model, { model: id })

    expect(result).toMatchObject({ id })
  })
})
