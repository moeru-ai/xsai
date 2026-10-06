import type { RetrieveModel } from '../src'

import { describe, expect, it } from 'vitest'

import { retrieveModel } from '../src'

describe('retrieveModel', () => {
  it('retrieves a model from a custom adapter without HTTP configuration', async () => {
    const model: RetrieveModel = {
      list: async () => [{ id: 'local-model' }],
      retrieve: async options => ({ id: options.model }),
    }

    await expect(retrieveModel(model, { model: 'other-local-model' })).resolves.toStrictEqual({ id: 'other-local-model' })
  })

  it('preserves an unsupported operation error', async () => {
    const error = new Error('Retrieving models is not supported')
    const model: RetrieveModel = {
      list: async () => [{ id: 'local-model' }],
      retrieve: async () => { throw error },
    }

    await expect(retrieveModel(model, { model: 'local-model' })).rejects.toBe(error)
  })

  it('rejects the promise when an adapter throws synchronously', async () => {
    const error = new Error('Retrieving models failed before starting')
    const model: RetrieveModel = {
      list: async () => [{ id: 'local-model' }],
      retrieve: () => { throw error },
    }

    await expect(retrieveModel(model, { model: 'local-model' })).rejects.toBe(error)
  })
})
