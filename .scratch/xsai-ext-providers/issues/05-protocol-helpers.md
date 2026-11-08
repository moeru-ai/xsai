# Add per-protocol helper subpaths

Parent: ../map.md
Type: task
Labels: needs-triage
Status: resolved
Blocked by: 01, 03, 09

## Scope

Add `/text-chat`, `/text-messages`, `/text-responses`, `/embed`, `/audio`, and `/image`.
Each helper takes a provider data object, a model ID, and caller HTTP options (`apiKey`, `headers`, `fetch`), then calls its xsAI adapter with the resolved route.
Declare each adapter as an optional peer dependency pinned to the current beta.
Decide whether `route()` falls back to a provider-level base URL.

## Acceptance

- A model without a route for the helper's protocol throws before fetch.
- Each helper subpath bundles only its own adapter.
- Caller options override nothing in the route except auth, headers, and fetch.

## Comments

2026-11-08 decisions:

- `route()` uses the model's route when the model is known. For an unknown model ID it uses `provider.defaults[protocol]`. Without either it throws.
- Route `path` is passed to the adapter through the new `HttpOptions.path` (issue 09).

## Answer

Resolved and implemented on 2026-11-08 in `dfb446f7` on this branch. The design changed after a usability review.

### Why the per-protocol design changed

- 389 chat models have no `chat` route (196 Responses only, 193 Messages only), and 1553 have two or three text routes. A per-protocol helper makes the caller look up `model.routes` first, although all three text adapters return `LanguageModel`.
- `chat` from `@xsai-ext/providers/text-chat` would clash with `chat` from `@xsai/text-chat`.
- A variant where the caller passes adapters (`connect(openai, 'gpt-5', { responses, chat })`) was prototyped and rejected: callers of this package want convenience, not protocol choice.

### Design

- One helper subpath per xsAI package. Each helper picks the protocol itself:

  | Subpath | Helpers | Protocol order |
  | --- | --- | --- |
  | `/text` | `languageModel` | `responses`, `messages`, `chat` |
  | `/embed` | `embeddingModel` | `embeddings` |
  | `/image` | `imageModel` | `generations` |
  | `/audio` | `speechModel`, `transcriptionModel` | `speech`, `transcriptions` |
  | `/decide` | `decisionModel` | `decisions`, `systemone` |

- The text order is fixed: richest protocol first. Gateways such as OpenRouter and Vercel also get Responses, and DeepSeek gets its Messages-compatible endpoint. `options.protocol` selects one protocol instead.
- Helper names follow the xsAI model types, because `embed`, `decide`, and `speech` are already exports of the xsAI packages that callers use with them.
- `ModelOptions`: `apiKey`, `headers`, `fetch`, `protocol`, `variables`. Nothing else in the route can be overridden.
- The root entry exports `route(provider, model, protocols, { variables })`, which returns `{ baseURL, model, path, protocol }`, and `accepts(model, mime)`. It has no `@xsai/*` dependency and throws plain `Error`.
- A known model uses only its own routes, with no fallback to `defaults`. An unknown model ID uses `provider.defaults`. A missing template variable throws.
- Every adapter package is an optional peer dependency (`workspace:`, so it pins the current beta) and a dev dependency. Return types use `ReturnType<typeof adapter>`, so declarations import only adapter packages.
- Reserved subpaths: `text` replaces `text-chat`, `text-messages`, and `text-responses`.

Validation:

- Acceptance: helpers throw before fetch without a route (test). The `/embed` and `/audio` bundles contain no text adapter (rolldown). Only `apiKey`, `headers`, and `fetch` reach the adapter from options (test).
- `vitest run`: 58 files, 466 tests. `pnpm typecheck`. ESLint: no errors.

### Amendment (2026-11-08): `createProvider`

Implemented in `7f755a09`. Replaces the helper subpaths above after a second usability review: `languageModel(openai, 'gpt-5', { apiKey })` passes credentials per model, and the names were clumsy.

Other SDKs bind credentials to the provider, not the model: Vercel AI SDK (`createOpenAI({ apiKey })`, then `openai('gpt-5')`, `openai.responses()`, `openai.chat()`), Rig (`OpenAI::from_env()?.completion(...)`), Pydantic AI (`OpenAIProvider(api_key=...)`). String registries (Mastra `"openai/gpt-x"`, Pydantic `'openai:...'`, Vercel `registry.languageModel`) would need all provider data in the bundle, so they do not fit. pi-ai also lets model data choose the protocol.

```ts
import { createProvider } from '@xsai-ext/providers/create'
import { openai } from '@xsai-ext/providers/openai'

const provider = createProvider(openai, { apiKey })
provider.text('gpt-5')
provider.text('gpt-5', { protocol: 'chat' })
provider.embedding('text-embedding-3-small')
```

- One subpath, `/create`, with `createProvider(provider, options)` returning `ProviderClient<TModel>`: `text`, `embedding`, `image`, `speech`, `transcription`, `decision`. Protocol order is unchanged; `text` and `decision` take `{ protocol }`.
- Provider data subpaths stay data only. Methods on the data objects would make every data import carry adapters.
- `/create` imports every adapter. All adapters bundle to 11.9 KB gzipped against 9.7 KB for the text adapters alone, so separate subpaths are not worth it. `createProvider` with OpenAI data is 15.1 KB gzipped.
- `ProviderOptions` (`apiKey`, `headers`, `fetch`, `variables`) replaces `ModelOptions`.
- When `process.env` exists, unset `apiKey` comes from the first set variable in `provider.apiKeyEnv`, and unset template variables from variables of the same name. Explicit options win; empty strings count as unset.
- New data field `Provider.apiKeyEnv?: string[]`, computed by normalization: `env` minus template variables; when several remain, only names with `API_KEY`, `APIKEY`, or `TOKEN`, or ending in `_PAT`. Correct on 225 of 235 providers by inspection; overrides set `[]` for `google-vertex` (service account file) and `sap-ai-core` (JSON service key).
- Reserved subpaths: `create` replaces `text`, `embed`, `image`, `audio`, and `decide`.

Validation: `vitest run` 58 files, 471 tests; `pnpm typecheck`; ESLint clean. A run with only `OPENAI_API_KEY`, `AWS_REGION`, and `AWS_BEARER_TOKEN_BEDROCK` set reached `https://api.openai.com/v1/responses`, `.../chat/completions`, `.../embeddings`, and `https://bedrock-mantle.us-east-1.api.aws/anthropic/v1/messages`.

### Amendment 2 (2026-11-08): clients on provider subpaths

Implemented in `ce7e79e5` and `8e9ff3ac` after a user-flow review against Vercel AI SDK, pi-ai, Mastra, Pydantic AI, and Rig.

```ts
import { openai } from '@xsai-ext/providers/openai'
import { generateText } from 'xsai'

await generateText(openai.text('gpt-5'), { input })
const custom = createOpenai({ apiKey, baseURL })
```

Findings and decisions:

- Install: `/create` imported seven optional peers statically, so a missing one broke the import. It now imports adapters from `xsai`, the only (optional) peer. Callers install `xsai` and `@xsai-ext/providers`, like `ai` and `@ai-sdk/openai`.
- `baseURL` option: replaces the route base URL and keeps its path, for hosts the catalog cannot know (Ollama on another machine, proxies). This overrides the earlier acceptance rule that only auth, headers, and fetch can be overridden.
- Errors: clients throw `XSAIError('invalid-input')`. `route()` keeps plain `Error`.
- Layout (Vercel): provider subpaths export a default client and a factory (`openai`, `createOpenai`; `createAmazonBedrock`; `create302ai`). Each holds routes only, so `openai.text` bundles to 13.0 KB gzipped and `openrouter.text` to 16.9 KB (it was over 35 KB with full data). Full data moves to `/models/<id>`, which stays free of xsAI (2.8 KB for OpenAI). This resolves the name clash between data and client and supersedes "data subpaths have no `@xsai/*` dependency" for provider subpaths. The default client is `/* @__PURE__ */`, so importing only the factory drops it.
- Protocol order (pi-ai): data decides. pi-ai picks one API per model in hand-written provider definitions: Responses for OpenAI, Messages for Anthropic, completions for gateways, ID rules for GitHub Copilot. Here, `Provider.protocols` sets a preference through overrides: `openai`, `azure`, `xai` prefer `responses`; `anthropic`, `github-copilot` prefer `messages`. Everything else uses the default order `chat`, `responses`, `messages`. This replaces the fixed Responses-first order. No model-level preference is needed yet.
- Method options: `text(model, { protocol, ...defaults })`. Every call option except `input` and `signal` can be a default. Call options win; `providerOptions` merge per namespace. All methods take the same shape.
- `ProviderRoutes`: compact routes per model, ordered by preference. A protocol string means the provider default base URL; `[protocol, baseURL, path?]` otherwise. `toRoutes()` builds it from `Provider`, so `createProvider` in `/create` still turns `/models/*` data or `fetchProviders()` results into a client.
- Env values are read when a model is created, so default clients can be created at import time.
- Reserved subpaths: adds `models`.

Not changed: data size for metadata users, and model ID completion listing every model type for every method.

Validation: `vitest run` 59 files, 481 tests; `pnpm typecheck`; ESLint clean. With only API key variables set, requests went to OpenAI Responses (and Chat with `protocol`), Anthropic Messages, DeepSeek and OpenRouter Chat Completions, and a custom Ollama host.

### Amendment 3 (2026-11-08): transcription streaming

From nekomeowww's PR #350 review (format, stream, and transport info for audio).

- `transcription()` uses `transcriptionsNonStreaming` by default. `transcriptions` sends `stream: true` and requires an SSE response, and models.dev has no data on which models support it (OpenAI `whisper-1` does not). `transcription(model, { stream: true })` selects `transcriptions`.
- No per-provider or per-model streaming default, like the text protocol preference: models.dev has no streaming data, and hand-kept lists would drift.
- Upload format (FormData with a `Blob`) and transport (HTTP) follow from the protocol, so they get no fields.
- The root entry no longer exports `accepts()` (see issue 01, amendment 7).
