import type { ModelCatalog } from '../src'

import { describe, expect, it } from 'vitest'

import { retrieveModel } from '../src'

describe('retrieveModel', () => {
  it.each([false, true])('retrieves a model from a custom catalog without HTTP configuration (async: %s)', async (isAsync) => {
    const catalog: ModelCatalog = {
      list: async () => [{ id: 'local-model' }],
      retrieve: (options): ReturnType<ModelCatalog['retrieve']> => {
        const entry = { id: options.id }
        return isAsync ? Promise.resolve(entry) : entry
      },
    }

    await expect(retrieveModel(catalog, { id: 'other-local-model' })).resolves.toStrictEqual({ id: 'other-local-model' })
  })

  it('preserves an unsupported operation error', async () => {
    const error = new Error('Retrieving models is not supported')
    const catalog: ModelCatalog = {
      list: async () => [{ id: 'local-model' }],
      retrieve: async () => { throw error },
    }

    await expect(retrieveModel(catalog, { id: 'local-model' })).rejects.toBe(error)
  })

  it('rejects the promise when an adapter throws synchronously', async () => {
    const error = new Error('Retrieving models failed before starting')
    const catalog: ModelCatalog = {
      list: async () => [{ id: 'local-model' }],
      retrieve: () => { throw error },
    }

    await expect(retrieveModel(catalog, { id: 'local-model' })).rejects.toBe(error)
  })
})
