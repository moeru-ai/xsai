# @xsai-ext/providers

Provider routes, model capabilities, and costs from [models.dev](https://models.dev), normalized for xsAI.

```sh
pnpm add @xsai-ext/providers
```

```ts
import { openai } from '@xsai-ext/providers/openai'
import { languageModel } from '@xsai-ext/providers/text'
import { generateText } from '@xsai/text'

const model = languageModel(openai, 'gpt-5', { apiKey: process.env.OPENAI_API_KEY })
const { text } = await generateText(model, { input: 'Say hello.' })
```

Each provider is its own subpath, so an import bundles only that provider's data.
`@xsai-ext/providers/full` exports all providers as `providers`, keyed by provider ID.

## Helpers

Each helper subpath creates an xsAI model from a provider and a model ID. Install the xsAI package it uses.

| Subpath | Helpers | xsAI package | Protocols, in order of preference |
| --- | --- | --- | --- |
| `/text` | `languageModel` | `@xsai/text-responses`, `@xsai/text-messages`, `@xsai/text-chat` | `responses`, `messages`, `chat` |
| `/embed` | `embeddingModel` | `@xsai/embed` | `embeddings` |
| `/image` | `imageModel` | `@xsai/image` | `generations` |
| `/audio` | `speechModel`, `transcriptionModel` | `@xsai/audio` | `speech`, `transcriptions` |
| `/decide` | `decisionModel` | `@xsai/decide` | `decisions`, `systemone` |

Options:

- `apiKey`, `headers`, and `fetch` go to the adapter. The route sets the base URL and path.
- `protocol` selects one protocol instead of the order above.
- `variables` fills templates in base URLs, such as `{ AWS_REGION: 'us-east-1' }`.

A model ID that is not in the catalog uses the provider's default base URL for the protocol.
A helper throws before any request when the model has no route for its protocols, or when a variable is missing.

`route(provider, model, protocols)` from the root entry returns the resolved `{ baseURL, model, path, protocol }` without creating a model.
`accepts(model, 'image/*')` checks the model's input MIME types.

## Sync

`pnpm sync` downloads the models.dev v2 catalog and regenerates `src/providers/*.ts` and `src/full.ts`.
Pass a local catalog path to skip the download: `pnpm sync ./api.json`.

- Put corrections in `scripts/overrides.ts`, with a comment that gives the reason. Prefer fixing models.dev upstream.
- Put providers that models.dev does not list in `scripts/extra.ts`.
