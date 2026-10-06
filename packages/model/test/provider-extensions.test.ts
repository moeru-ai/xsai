import type { ModelCatalog, ModelCatalogEntry } from '../src'

import { describe, expect, it } from 'vitest'

import { listModels, retrieveModel } from '../src'

declare module '@xsai/model' {
  interface ModelCatalogProviderMetadata {
    registry?: {
      displayName: string
      region: string
    }
  }

  interface ModelCatalogProviderOptions {
    registry?: {
      region: string
    }
  }
}

const entries: ModelCatalogEntry[] = [
  { id: 'east-model', providerMetadata: { registry: { displayName: 'East model', region: 'east' } } },
  { id: 'west-model', providerMetadata: { registry: { displayName: 'West model', region: 'west' } } },
]

const registry: ModelCatalog = {
  list: async (options = {}) => {
    options.signal?.throwIfAborted()
    return entries.filter(entry => entry.providerMetadata?.registry?.region === options.providerOptions?.registry?.region)
  },
  retrieve: async (options) => {
    options.signal?.throwIfAborted()
    const entry = entries.find(entry => entry.id === options.id && entry.providerMetadata?.registry?.region === options.providerOptions?.registry?.region)
    if (entry == null)
      throw new Error('Model not found in this region')
    return entry
  },
}

describe('provider extensions', () => {
  it('passes list options and preserves third-party metadata', async () => {
    const result = await listModels(registry, { providerOptions: { registry: { region: 'west' } } })

    expect(result).toStrictEqual([{
      id: 'west-model',
      providerMetadata: { registry: { displayName: 'West model', region: 'west' } },
    }])
  })

  it('passes retrieve options and preserves third-party metadata', async () => {
    const result = await retrieveModel(registry, { id: 'east-model', providerOptions: { registry: { region: 'east' } } })

    expect(result).toBe(entries[0])
    expect(result.providerMetadata).toStrictEqual({ registry: { displayName: 'East model', region: 'east' } })
  })

  it('passes list cancellation to a third-party adapter', async () => {
    const reason = new Error('Stop listing')

    await expect(listModels(registry, {
      providerOptions: { registry: { region: 'east' } },
      signal: AbortSignal.abort(reason),
    })).rejects.toBe(reason)
  })

  it('passes retrieve cancellation to a third-party adapter', async () => {
    const reason = new Error('Stop retrieving')

    await expect(retrieveModel(registry, {
      id: 'east-model',
      providerOptions: { registry: { region: 'east' } },
      signal: AbortSignal.abort(reason),
    })).rejects.toBe(reason)
  })
})
