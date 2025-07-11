import { describe, expect, it } from 'vitest'

import { listModels, retrieveModel } from '../src'

describe('@xsai/model', () => {
  const model = 'granite3.3:2b'

  it('listModels', async () => {
    const models = await listModels({
      baseURL: 'http://localhost:11434/v1/',
    })

    const granite = models.find(({ id }) => id === model)!

    expect(granite.id).toBe(model)
    expect(granite.object).toBe('model')
    expect(granite.owned_by).toBe('library')
  })

  it('retrieveModel', async () => {
    const granite = await retrieveModel({
      baseURL: 'http://localhost:11434/v1/',
      model,
    })

    expect(granite.id).toBe(model)
    expect(granite.object).toBe('model')
    expect(granite.owned_by).toBe('library')
  })
})
