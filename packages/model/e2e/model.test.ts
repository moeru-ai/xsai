import { env } from 'node:process'

import { describe, expect, it } from 'vitest'

import { listModels, retrieveModel } from '../src'

const baseURL = env.XSAI_E2E_BASE_URL!
const models = [env.XSAI_E2E_MODEL!, env.XSAI_E2E_MODEL_EMBED!]

describe('model e2e', () => {
  it('lists the configured Ollama text and embedding models', async () => {
    const result = await listModels({ baseURL })

    for (const id of models)
      expect(result.some(model => model.id === id), `expected Ollama to list ${id}`).toBe(true)
  })

  it.each(models)('retrieves the Ollama model %s', async (model) => {
    const result = await retrieveModel({ baseURL, model })

    expect(result).toMatchObject({ id: model, object: 'model' })
  })
})
