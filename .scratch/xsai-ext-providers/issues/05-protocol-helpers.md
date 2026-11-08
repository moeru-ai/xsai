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
