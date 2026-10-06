import type { TranscriptionModel, TranscriptionSegment, TranscriptionWord } from '../src'

import { describe, expect, expectTypeOf, it } from 'vitest'

import { generateTranscription } from '../src'

declare module '@xsai/audio' {
  interface TranscriptionModelProviderOptions {
    custom?: { language: string }
  }

  interface TranscriptionSegmentProviderMetadata {
    custom?: { confidence: number }
  }

  interface TranscriptionWordProviderMetadata {
    custom?: { tag: string }
  }
}

describe('provider extensions', () => {
  it('collects an independent transcription adapter with its own options and metadata', async () => {
    const model: TranscriptionModel = options => new ReadableStream({
      start: (output) => {
        output.enqueue({ type: 'transcription.start' })
        output.enqueue({
          segments: [{ endSecond: 1, providerMetadata: { custom: { confidence: 0.9 } }, startSecond: 0, text: 'hello' }],
          text: options.providerOptions?.custom?.language ?? '',
          type: 'transcription.end',
          words: [{ endSecond: 1, providerMetadata: { custom: { tag: 'greeting' } }, startSecond: 0, text: 'hello' }],
        })
        output.close()
      },
    })

    expect(await generateTranscription(model, {
      audio: new Blob(['audio']),
      providerOptions: { custom: { language: 'en' } },
    })).toEqual({
      segments: [{ endSecond: 1, providerMetadata: { custom: { confidence: 0.9 } }, startSecond: 0, text: 'hello' }],
      text: 'en',
      words: [{ endSecond: 1, providerMetadata: { custom: { tag: 'greeting' } }, startSecond: 0, text: 'hello' }],
    })
    type SegmentMetadata = NonNullable<TranscriptionSegment['providerMetadata']>
    type WordMetadata = NonNullable<TranscriptionWord['providerMetadata']>
    expectTypeOf<NonNullable<SegmentMetadata['custom']>>().toEqualTypeOf<{ confidence: number }>()
    expectTypeOf<NonNullable<WordMetadata['custom']>>().toEqualTypeOf<{ tag: string }>()
    expectTypeOf<NonNullable<SegmentMetadata['transcriptions']>>().not.toHaveProperty('probability')
    expectTypeOf<NonNullable<WordMetadata['transcriptions']>>().not.toHaveProperty('speaker')
  })
})
