import { describe, expect, it } from 'vitest'

import { listModels, retrieveModel } from '../src'

describe('@xsai/model', () => {
  const modelId = 'qwen3.5:2b'

  it('listModels', async () => {
    const models = await listModels({
      baseURL: 'http://localhost:11434/v1/',
    })

    const model = models.find(({ id }) => id === modelId)!

    expect(model.id).toBe(modelId)
    expect(model.object).toBe('model')
    expect(model.owned_by).toBe('library')
  })

  it('retrieveModel', async () => {
    const model = await retrieveModel({
      baseURL: 'http://localhost:11434/v1/',
      model: modelId,
    })

    expect(model.id).toBe(modelId)
    expect(model.object).toBe('model')
    expect(model.owned_by).toBe('library')
  })
})
