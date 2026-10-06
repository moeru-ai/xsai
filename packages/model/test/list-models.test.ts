import type { RetrieveModel } from '../src'

import { describe, expect, it } from 'vitest'

import { listModels } from '../src'

describe('listModels', () => {
  it('lists models from a custom adapter without HTTP configuration', async () => {
    const model: RetrieveModel = {
      list: async (options) => {
        expect(options).toStrictEqual({})
        return [{ id: 'local-model' }]
      },
      retrieve: async options => ({ id: options.model }),
    }

    await expect(listModels(model)).resolves.toStrictEqual([{ id: 'local-model' }])
  })

  it('preserves an unsupported operation error', async () => {
    const error = new Error('Listing models is not supported')
    const model: RetrieveModel = {
      list: async () => { throw error },
      retrieve: async options => ({ id: options.model }),
    }

    await expect(listModels(model)).rejects.toBe(error)
  })

  it('rejects the promise when an adapter throws synchronously', async () => {
    const error = new Error('Listing models failed before starting')
    const model: RetrieveModel = {
      list: () => { throw error },
      retrieve: async options => ({ id: options.model }),
    }

    await expect(listModels(model)).rejects.toBe(error)
  })
})
