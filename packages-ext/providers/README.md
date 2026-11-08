# @xsai-ext/providers

Provider routes, model capabilities, and costs from [models.dev](https://models.dev), normalized for xsAI.

```sh
pnpm add @xsai-ext/providers
```

```ts
import { createProvider } from '@xsai-ext/providers/create'
import { openai } from '@xsai-ext/providers/openai'
import { generateText } from '@xsai/text'

const provider = createProvider(openai, { apiKey: process.env.OPENAI_API_KEY })
const { text } = await generateText(provider.text('gpt-5'), { input: 'Say hello.' })
```

Each provider is its own subpath, so an import bundles only that provider's data.
`@xsai-ext/providers/full` exports all providers as `providers`, keyed by provider ID.

## createProvider

`createProvider(provider, options)` from `/create` binds a provider to credentials. Its methods create xsAI models from model IDs:

| Method | xsAI package | Protocols, in order of preference |
| --- | --- | --- |
| `text` | `@xsai/text-responses`, `@xsai/text-messages`, `@xsai/text-chat` | `responses`, `messages`, `chat` |
| `embedding` | `@xsai/embed` | `embeddings` |
| `image` | `@xsai/image` | `generations` |
| `speech` | `@xsai/audio` | `speech` |
| `transcription` | `@xsai/audio` | `transcriptions` |
| `decision` | `@xsai/decide` | `decisions`, `systemone` |

Install the xsAI packages for the methods you call. `/create` imports all of them.

Options:

- `apiKey`, `headers`, and `fetch` go to the adapter. The route sets the base URL and path.
- `variables` fills templates in base URLs, such as `{ AWS_REGION: 'us-east-1' }`.
- When `process.env` exists, an unset `apiKey` comes from the variables in `provider.apiKeyEnv`, and unset template variables come from variables of the same name.

`text` and `decision` take `{ protocol }` to select one protocol instead of the order above.

A model ID that is not in the catalog uses the provider's default base URL for the protocol.
A method throws before any request when the model has no route for its protocols, or when a variable is missing.

`route(provider, model, protocols)` from the root entry returns the resolved `{ baseURL, model, path, protocol }` without creating a model.
`accepts(model, 'image/*')` checks the model's input MIME types.

## Sync

`pnpm sync` downloads the models.dev v2 catalog and regenerates `src/providers/*.ts` and `src/full.ts`.
Pass a local catalog path to skip the download: `pnpm sync ./api.json`.

- Put corrections in `scripts/overrides.ts`, with a comment that gives the reason. Prefer fixing models.dev upstream.
- Put providers that models.dev does not list in `scripts/extra.ts`.
