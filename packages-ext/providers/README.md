# @xsai-ext/providers

Provider routes, model capabilities, and costs from [models.dev](https://models.dev), normalized for xsAI.

```sh
pnpm add @xsai-ext/providers
```

```ts
import { createProvider } from '@xsai-ext/providers/create'
import { openai } from '@xsai-ext/providers/openai'
import { generateText } from 'xsai'

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

`/create` needs `xsai`, which re-exports every adapter and `generateText`:

```sh
pnpm add xsai @xsai-ext/providers
```

Options:

- `apiKey`, `headers`, and `fetch` go to the adapter.
- `baseURL` replaces the base URL of every route and keeps the route's path, for example for Ollama on another host.
- `variables` fills templates in base URLs, such as `{ AWS_REGION: 'us-east-1' }`.
- When `process.env` exists, an unset `apiKey` comes from the variables in `provider.apiKeyEnv`, and unset template variables come from variables of the same name.

`text` and `decision` take `{ protocol }` to select one protocol instead of the order above.

A model ID that is not in the catalog uses the provider's default base URL for the protocol.
A method throws an `XSAIError` with code `invalid-input` before any request when the model has no route for its protocols, or when a variable is missing.

`route(provider, model, protocols)` from the root entry returns the resolved `{ baseURL, model, path, protocol }` without creating a model.
`accepts(model, 'image/*')` checks the model's input MIME types.

## Runtime data

`fetchProviders()` from `/fetch` downloads the current models.dev catalog and returns the same data as the provider subpaths, plus model descriptions.

```ts
import type { RuntimeProvider } from '@xsai-ext/providers'

import { fetchProviders } from '@xsai-ext/providers/fetch'

let stored: undefined | { etag?: string, providers: Record<string, RuntimeProvider> }

const result = await fetchProviders({ etag: stored?.etag })
if (!result.notModified)
  stored = { etag: result.etag, providers: result.providers }
```

- Pass the `etag` of a previous result to get `{ notModified: true }` when the catalog has not changed.
- `url` and `fetch` replace the default catalog URL and `fetch`.
- Invalid models and routes are skipped. It throws on an HTTP error, or when no valid provider is left.
- It has no fallback and no cache. Store the result yourself, or fall back to `/full` or the provider subpaths.

## Sync

`pnpm sync` downloads the models.dev v2 catalog and regenerates `src/providers/*.ts` and `src/full.ts`.
Pass a local catalog path to skip the download: `pnpm sync ./api.json`.

- Put corrections in `src/corrections/overrides.ts`, with a comment that gives the reason. Prefer fixing models.dev upstream.
- Put providers that models.dev does not list in `src/corrections/extra.ts`.
- `/fetch` applies the same corrections at runtime.
