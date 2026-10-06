import type { ImageModel, ImageModelOptions } from '../src'

import { describe, expect, it } from 'vitest'

import { generateImage } from '../src'

declare module '@xsai/image' {
  interface ImageModelProviderOptions {
    custom?: { label: string }
  }

  interface ImageModelResultProviderMetadata {
    custom?: { label: string }
  }
}

describe('generateImage', () => {
  it('returns the first image and preserves an independent model result', async () => {
    const images = [new Blob(['first']), new Blob(['second'])]
    const options: ImageModelOptions = {
      input: 'a cat',
      n: 3,
      providerOptions: { custom: { label: 'custom model' } },
      signal: new AbortController().signal,
      size: '1024x1024',
    }
    let calls = 0
    const model: ImageModel = (received) => {
      expect(received).toBe(options)
      calls++
      return {
        images,
        providerMetadata: { custom: { label: received.providerOptions!.custom!.label } },
      }
    }

    const pending = generateImage(model, options)
    expect(pending).toBeInstanceOf(Promise)
    const result = await pending
    expect(result.image).toBe(images[0])
    expect(result.images).toBe(images)
    expect(result.providerMetadata).toEqual({ custom: { label: 'custom model' } })
    expect(calls).toBe(1)
  })

  it('rejects an empty image result', async () => {
    await expect(generateImage(() => ({ images: [] }), { input: 'a cat' }))
      .rejects
      .toMatchObject({ code: 'invalid-response' })
  })

  it('preserves an independent model failure', async () => {
    const error = new Error('Model failed')
    const model: ImageModel = () => {
      throw error
    }
    await expect(generateImage(model, { input: 'a cat' })).rejects.toBe(error)
  })
})
