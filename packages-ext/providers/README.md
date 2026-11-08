# @xsai-ext/providers

Provider routes, model capabilities, and costs from [models.dev](https://models.dev), normalized for xsAI.

```sh
pnpm add xsai @xsai-ext/providers
```

```ts
import { openai } from '@xsai-ext/providers/openai'
import { generateText } from 'xsai'

// Reads OPENAI_API_KEY from process.env.
const { text } = await generateText(openai.text('gpt-5'), { input: 'Say hello.' })
```

## Clients

Each provider subpath exports a client and a factory: `openai` and `createOpenai`, `amazonBedrock` and `createAmazonBedrock`, `_302ai` and `create302ai`.

```ts
import { createOpenai } from '@xsai-ext/providers/openai'

const openai = createOpenai({ apiKey: 'sk-...' })
```

| Method | xsAI model | Protocols |
| --- | --- | --- |
| `text` | `LanguageModel` | `chat`, `responses`, `messages` |
| `embedding` | `EmbeddingModel` | `embeddings` |
| `image` | `ImageModel` | `generations` |
| `speech` | `SpeechModel` | `speech` |
| `transcription` | `TranscriptionModel` | `transcriptions` |
| `decision` | `DecisionModel` | `decisions`, `systemone` |

A method uses the first protocol that the model has a route for.
The order is Chat Completions first, unless the provider data sets another: OpenAI, Azure, and xAI prefer Responses; Anthropic and GitHub Copilot prefer Messages.

The second argument of a method selects a protocol and sets defaults for every call. Options of each call win, and `providerOptions` merge per namespace:

```ts
const model = openai.text('gpt-5', {
  protocol: 'chat',
  providerOptions: { chat: { seed: 1 } },
  temperature: 0.2,
})
```

Factory options:

- `apiKey`, `headers`, and `fetch` go to the adapter.
- `baseURL` replaces the base URL of every route and keeps the route's path, for example for Ollama on another host.
- `variables` fills templates in base URLs, such as `{ AWS_REGION: 'us-east-1' }`.
- When `process.env` exists, an unset `apiKey` comes from the variables in `apiKeyEnv`, and unset template variables come from variables of the same name. They are read when a model is created.

`transcription` does not stream by default, because not every model supports Server-Sent Events (SSE). Pass `stream: true` to request SSE:

```ts
const model = openai.transcription('gpt-4o-transcribe', { stream: true })
```

A model ID that is not in the catalog uses the provider's default base URL for the protocol.
A method throws an `XSAIError` with code `invalid-input` before any request when the model has no route for its protocols, or when a variable is missing.

## Model data

`@xsai-ext/providers/models/<id>` exports all data of a provider, with no xsAI dependency: names, limits, modalities, capabilities, prices, and routes.

```ts
import { openai } from '@xsai-ext/providers/models/openai'

const model = openai.models['gpt-5']
console.log(model.limit.context, model.cost?.input, model.modalities.input)
```

`modalities` lists input and output types as MIME types, such as `image/webp` or `audio/opus`.
A bare type such as `image` means the model takes that type but its formats are not listed.

`@xsai-ext/providers/full` exports all providers as `providers`, keyed by provider ID.
`createProvider(provider, options)` from `/create` creates a client from provider data, such as a `fetchProviders()` result.
`route(provider, model, protocols)` from the root entry returns the resolved `{ baseURL, model, path, protocol }`.

## Runtime data

`fetchProviders()` from `/fetch` downloads the current models.dev catalog and returns the same data as the `/models/*` subpaths, plus model descriptions.

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
- It has no fallback and no cache. Store the result yourself, or fall back to `/full` or `/models/*`.
- `createProvider(result.providers[id], { apiKey })` from `/create` turns a result into a client.

## Sync

`pnpm sync` downloads the models.dev v2 catalog and regenerates `src/models/*.ts`, `src/providers/*.ts`, and `src/full.ts`.
Pass a local catalog path to skip the download: `pnpm sync ./api.json`.

- Put corrections in `src/corrections/overrides.ts`, with a comment that gives the reason. Prefer fixing models.dev upstream.
- Put providers that models.dev does not list in `src/corrections/extra.ts`.
- `/fetch` applies the same corrections at runtime.
