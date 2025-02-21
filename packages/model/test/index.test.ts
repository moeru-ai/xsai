import { describe, expect, it } from 'vitest'

import { listModels, retrieveModel } from '../src'

describe('@xsai/model', () => {
  it('listModels', async () => {
    const models = await listModels({
      baseURL: 'http://localhost:11434/v1/',
    })

    const llama = models.find(({ id }) => id === 'llama3.2:latest')!

    expect(llama.id).toBe('llama3.2:latest')
    expect(llama.object).toBe('model')
    expect(llama.owned_by).toBe('library')
  })

  it('retrieveModel', async () => {
    const llama = await retrieveModel({
      baseURL: 'http://localhost:11434/v1/',
      model: 'llama3.2:latest',
    })

    expect(llama.id).toBe('llama3.2:latest')
    expect(llama.object).toBe('model')
    expect(llama.owned_by).toBe('library')
  })
})
