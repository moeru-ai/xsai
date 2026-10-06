import type { ModelCatalog } from '../src'

import { describe, expect, it } from 'vitest'

import { listModels } from '../src'

describe('listModels', () => {
  it.each([false, true])('lists models from a custom catalog without HTTP configuration (async: %s)', async (isAsync) => {
    const catalog: ModelCatalog = {
      list: (options): ReturnType<ModelCatalog['list']> => {
        expect(options).toStrictEqual({})
        const entries = [{ id: 'local-model' }]
        return isAsync ? Promise.resolve(entries) : entries
      },
      retrieve: async options => ({ id: options.id }),
    }

    await expect(listModels(catalog)).resolves.toStrictEqual([{ id: 'local-model' }])
  })

  it('preserves an unsupported operation error', async () => {
    const error = new Error('Listing models is not supported')
    const catalog: ModelCatalog = {
      list: async () => { throw error },
      retrieve: async options => ({ id: options.id }),
    }

    await expect(listModels(catalog)).rejects.toBe(error)
  })

  it('rejects the promise when an adapter throws synchronously', async () => {
    const error = new Error('Listing models failed before starting')
    const catalog: ModelCatalog = {
      list: () => { throw error },
      retrieve: async options => ({ id: options.id }),
    }

    await expect(listModels(catalog)).rejects.toBe(error)
  })
})
