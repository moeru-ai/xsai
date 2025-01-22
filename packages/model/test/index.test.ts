import { ollama } from '@xsai/providers'
import { describe, expect, it } from 'vitest'

import { listModels, retrieveModel } from '../src'

describe('@xsai/model', () => {
  it('listModels', async () => {
    const models = await listModels({
      ...ollama.model(),
    })

    const llama = models.find(({ id }) => id === 'llama3.2:latest')!

    expect(llama.id).toBe('llama3.2:latest')
    expect(llama.object).toBe('model')
    expect(llama.owned_by).toBe('library')
  })

  it('retrieveModel', async () => {
    const llama = await retrieveModel({
      ...ollama.model(),
      model: 'llama3.2:latest',
    })

    expect(llama.id).toBe('llama3.2:latest')
    expect(llama.object).toBe('model')
    expect(llama.owned_by).toBe('library')
  })
})
