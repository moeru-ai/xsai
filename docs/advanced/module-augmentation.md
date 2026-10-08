# Module augmentation

Many xsAI types have a slot for provider-specific data, such as `providerOptions` on a request or `providerMetadata` on a result.
Each slot is an empty interface that packages fill through TypeScript module augmentation.
The adapters use it, and you can use it to type the options and metadata of your own model.

## How the adapters use it

`@xsai/text-responses` declares this, in its own source:

```ts
import type { ResponsesProviderOptions } from '@xsai/text-responses'

declare module '@xsai/text' {
  interface LanguageModelProviderOptions {
    responses?: ResponsesProviderOptions
  }
}
```

TypeScript merges the declaration with the empty `LanguageModelProviderOptions` in `@xsai/text`.
After you import `@xsai/text-responses`, `providerOptions: { responses: { store: true } }` type-checks.
A package for another protocol adds its own key, so the keys never overlap.

## Add options for a model

This example adds a `region` option for a model called `example`.
The model reads it from `providerOptions.example`.

```ts
import type { LanguageModel, TextEvent } from '@xsai/text'

import { generateText } from '@xsai/text'

const textStream = (text: string) => new ReadableStream<TextEvent>({
  start: (controller) => {
    controller.enqueue({ type: 'step.start' })
    controller.enqueue({ content: { text, type: 'text' }, index: 0, type: 'content.end' })
    controller.enqueue({ message: { content: [{ text, type: 'text' }], role: 'assistant' }, status: 'completed', type: 'step.end' })
    controller.close()
  },
})
// ---cut---
declare module '@xsai/text' {
  interface LanguageModelProviderOptions {
    example?: { region?: 'eu' | 'us' }
  }
}

const example = (): LanguageModel => ({ providerOptions }) =>
  textStream(`Served from ${providerOptions?.example?.region ?? 'us'}.`)

const { text } = await generateText(example(), {
  input: 'Hi.',
  providerOptions: { example: { region: 'eu' } },
})
console.log(text)
```

The compiler now checks the namespace.
A misspelled field is an error:

```ts
// @errors: 2561
import type { LanguageModel } from '@xsai/text'

declare const model: LanguageModel

declare module '@xsai/text' {
  interface LanguageModelProviderOptions {
    example?: { region?: 'eu' | 'us' }
  }
}

await model({ input: 'Hi.', providerOptions: { example: { regoin: 'eu' } } })
```

## Add metadata to a result

Metadata slots work the same way.
This example adds `citations` to every text Part.

```ts
import type { LanguageModel } from '@xsai/text'

import { generateText } from '@xsai/text'

declare const model: LanguageModel
// ---cut---
declare module '@xsai/text' {
  interface PartProviderMetadata {
    example?: { citations?: string[] }
  }
}

const { message } = await generateText(model, { input: 'Hi.' })

if (typeof message.content !== 'string') {
  for (const part of message.content) {
    if (part.type === 'text')
      console.log(part.providerMetadata?.example?.citations)
  }
}
```

## Add an error code

`XSAIErrorCauseMap` in `@xsai/shared` maps each error code to the type of its `cause`.
`undefined` forbids a cause, `unknown` makes it optional, and any other type requires it.

```ts
import { XSAIError } from '@xsai/shared'

declare module '@xsai/shared' {
  interface XSAIErrorCauseMap {
    'quota-exceeded': { limit: number }
  }
}

throw new XSAIError('quota-exceeded', 'The daily quota is used up.', { cause: { limit: 100 } })
```

## Extension points

| Package | Interface | Slot |
| --- | --- | --- |
| `@xsai/text` | `LanguageModelProviderOptions` | `providerOptions` of a text request. |
| `@xsai/text` | `PartProviderMetadata` | `providerMetadata` of a Part. |
| `@xsai/text` | `MessageProviderMetadata` | `providerMetadata` of a message. |
| `@xsai/audio` | `SpeechModelProviderOptions` | `providerOptions` of a speech request. |
| `@xsai/audio` | `TranscriptionModelProviderOptions` | `providerOptions` of a transcription request. |
| `@xsai/audio` | `TranscriptionSegmentProviderMetadata`, `TranscriptionWordProviderMetadata` | `providerMetadata` of a segment or a word. |
| `@xsai/embed` | `EmbeddingModelProviderOptions` | `providerOptions` of an embedding request. |
| `@xsai/image` | `ImageModelProviderOptions`, `ImageModelResultProviderMetadata` | `providerOptions` of a request, and `providerMetadata` of a result. |
| `@xsai/model` | `ModelCatalogProviderOptions`, `ModelCatalogEntryProviderMetadata` | `providerOptions` of a request, and `providerMetadata` of an entry. |
| `@xsai/shared` | `XSAIErrorCauseMap` | Error codes and their causes. |

## Rules

1. Augment the package that declares the interface, as in the table.
2. The file must be a module, so it needs at least one `import` or `export`. Without one, `declare module` replaces the package types instead of extending them.
3. Make each property optional, so code that does not use your model still compiles.
4. Use a key that is unique to your package, such as the name of its factory. Two packages that declare the same key with different types make the build fail.
5. An augmentation applies to the whole project, not to one model. Every model type accepts the key, and a model ignores keys that it does not read.
6. If you publish a package, export the augmentation from its entry point, so it applies when a user imports your package.
