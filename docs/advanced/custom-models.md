# Write a custom model

Every xsAI operation takes a model as its first argument, and a model is a plain function.
The HTTP adapters, such as `responses()` and `embeddings()`, are functions of this kind.
Write your own to test code without a service, to wrap a protocol that has no adapter, or to serve a local backend.

| Package | Model type | Receives | Returns | Used by |
| --- | --- | --- | --- | --- |
| `@xsai/text` | `LanguageModel` | `LanguageModelOptions` | `ReadableStream<TextEvent>` | `generateText`, `streamText`, `loop` |
| `@xsai/audio` | `SpeechModel` | `SpeechModelOptions` | `Response` with audio | `generateSpeech`, `streamSpeech` |
| `@xsai/audio` | `TranscriptionModel` | `TranscriptionModelOptions` | `ReadableStream<TranscriptionEvent>` | `generateTranscription`, `streamTranscription` |
| `@xsai/embed` | `EmbeddingModel` | `EmbeddingModelOptions` | `{ embeddings, usage? }` | `embed`, `embedMany` |
| `@xsai/image` | `ImageModel` | `ImageModelOptions` | `{ images, providerMetadata? }` | `generateImage` |
| `@xsai/model` | `ModelCatalog` | An object with `list` and `retrieve` | `ModelCatalogEntry` values | `listModels`, `retrieveModel` |

Each function can return its value directly or in a promise.
Each takes an optional `signal`, so a model that does asynchronous work must stop when the signal aborts.
When the input or the output is invalid, throw an `XSAIError` such as `invalid-input` or `invalid-response`.

## Language model

A language model returns a stream of [`TextEvent`](/text/events) values.
This one answers with a fixed text.

```ts
import type { LanguageModel, TextEvent } from '@xsai/text'

import { generateText } from '@xsai/text'

const model: LanguageModel = () => new ReadableStream<TextEvent>({
  start: (controller) => {
    controller.enqueue({ type: 'step.start' })
    controller.enqueue({ contentType: 'text', index: 0, type: 'content.start' })
    controller.enqueue({ delta: 'Hello.', index: 0, type: 'text.delta' })
    controller.enqueue({ content: { text: 'Hello.', type: 'text' }, index: 0, type: 'content.end' })
    controller.enqueue({
      message: { content: [{ text: 'Hello.', type: 'text' }], role: 'assistant' },
      reason: 'stop',
      status: 'completed',
      type: 'step.end',
    })
    controller.close()
  },
})

const { text } = await generateText(model, { input: 'Hi.' })
console.log(text)
```

Follow three rules:

1. Emit exactly one `step.end` for each request, including a request that produces no text.
2. Give each Part a `content.start`, its deltas, and a `content.end`, all with the same `index`.
3. Report a failure with a `step.end` that has `status: 'failed'` and an `error`.

A stream that ends without `step.end` makes the operation reject with `truncated-stream`.
More than one `step.end` in one request is a `protocol-error`.

## Other models

The other models are shorter, because their results have no events to order.
Each example below runs without a service.

::: code-group

```ts [Speech]
import type { SpeechModel } from '@xsai/audio'

import { generateSpeech } from '@xsai/audio'

const model: SpeechModel = ({ input }) =>
  new Response(new TextEncoder().encode(input), { headers: { 'content-type': 'audio/mpeg' } })

const audio = await generateSpeech(model, { input: 'Hello.', voice: 'test' })
console.log(audio.type, audio.size)
```

```ts [Transcription]
import type { TranscriptionEvent, TranscriptionModel } from '@xsai/audio'

import { generateTranscription } from '@xsai/audio'

const model: TranscriptionModel = () => new ReadableStream<TranscriptionEvent>({
  start: (controller) => {
    controller.enqueue({ type: 'transcription.start' })
    controller.enqueue({ delta: 'Hello.', type: 'transcription.text.delta' })
    controller.enqueue({ text: 'Hello.', type: 'transcription.end' })
    controller.close()
  },
})

const { text } = await generateTranscription(model, { audio: new Blob([]) })
console.log(text)
```

```ts [Embeddings]
import type { EmbeddingModel } from '@xsai/embed'

import { embed } from '@xsai/embed'

const model: EmbeddingModel = ({ input }) => ({
  embeddings: (Array.isArray(input) ? input : [input]).map(text => [text.length, 0]),
})

const { embedding } = await embed(model, { input: 'A quiet forest.' })
console.log(embedding)
```

```ts [Images]
import type { ImageModel } from '@xsai/image'

import { generateImage } from '@xsai/image'

const model: ImageModel = () => ({
  images: [new Blob([new Uint8Array(8)], { type: 'image/png' })],
})

const { image } = await generateImage(model, { input: 'A cabin.' })
console.log(image.type, image.size)
```

```ts [Models]
import type { ModelCatalog } from '@xsai/model'

import { listModels, retrieveModel } from '@xsai/model'

const catalog: ModelCatalog = {
  list: () => [{ id: 'local-small' }, { id: 'local-large' }],
  retrieve: ({ id }) => ({ id }),
}

console.log(await listModels(catalog))
console.log(await retrieveModel(catalog, { id: 'local-small' }))
```

:::

`generateTranscription` keeps the last `transcription.end` event as its result.
It rejects with `truncated-stream` if the stream has none.
`embed` rejects with `invalid-response` when `embeddings` is empty, and `generateImage` does the same when `images` is empty.

To give a custom model typed options of its own, read [Module augmentation](/advanced/module-augmentation).
