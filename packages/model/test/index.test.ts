import { describe, expect, it } from 'vitest'

import { listModels, retrieveModel } from '../src'

describe('@xsai/model', () => {
  it('listModels', async () => {
    const models = await listModels({
      url: new URL('models', 'http://localhost:11434/v1/'),
    })

    const llama = models.find(({ id }) => id === 'llama3.2:latest')!

    expect(llama.id).toBe('llama3.2:latest')
    expect(llama.object).toBe('model')
    expect(llama.owned_by).toBe('library')
  })

  it('retrieveModel', async () => {
    const llama = await retrieveModel({
      url: new URL('models/llama3.2:latest', 'http://localhost:11434/v1/'),
    })

    expect(llama.id).toBe('llama3.2:latest')
    expect(llama.object).toBe('model')
    expect(llama.owned_by).toBe('library')
  })
})
