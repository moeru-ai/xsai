# `@xsai-ext/providers` 1.0

Labels: wayfinder:map
Status: open

## Destination

Ship `@xsai-ext/providers` 1.0: provider routes, model capabilities, and costs normalized from models.dev v2, usable by xsAI 1.0 callers and by AIRI.

## Notes

- Source data is the models.dev v2 catalog (`https://models.dev/experimental/v2.0/api.json`). Its schema is experimental, so only our normalization layer reads it. Public types are ours.
- v2 keys each model's `api` by wire protocol. The keys map to xsAI packages: `chat-completions` → `text-chat`, `messages` → `text-messages`, `responses` → `text-responses`, `embeddings` → `embed`, `speech` / `transcriptions` → `audio`, `images` → `image`.
- References: old `@xsai-ext/providers` at `c63fe040:packages-ext/providers`; pi `packages/ai/catalog` (build-time codegen, per-provider corrections); opencode `packages/core/src/models-dev.ts` (runtime fetch, cache, bundled snapshot).
- AIRI keeps provider lifecycle, authentication, availability, and fetch wrappers (see `../airi-xsai-v1/issues/02-provider-boundary.md`). This package supplies data and thin helpers only.
- The v2 snapshot on 2026-11-08 has 233 providers and is about 10 MB. No provider ID collides with a reserved subpath. `302ai` needs a valid JS export name.

## Decisions so far

- One package, `@xsai-ext/providers`, with subpaths. Not named `models` because `@xsai/model` exists. The name is reused at 1.0; the 0.x API is not kept.
- Both delivery modes: build-time generated data and a runtime `/fetch` with a bundled snapshot fallback.
- The root entry exports types and `route()` only. It never exports all provider data. All providers live at `/full`.
- Each provider is a subpath (`@xsai-ext/providers/deepseek`) through one `"./*"` export pattern. Exact keys (`./costs`, `./capabilities`, `./fetch`, `./full`, helper subpaths) take precedence. Codegen fails when a provider ID matches a reserved subpath.
- `route()` is pure data and returns `HttpOptions`-compatible fields plus the protocol.
- Protocol helpers live in one subpath per xsAI package (`/text-chat`, `/text-messages`, `/text-responses`, `/embed`, `/image`, `/audio`, `/decide`). Each imports only its own package, declared as an optional peer dependency. Helpers take a provider data object, not an ID string. A model without a route for that protocol throws before fetch.
- Peer ranges pin the current xsAI beta until 1.0, then widen to `^1.0.0`.
- [Define the normalized types](issues/01-normalized-types.md): Include model types with an xsAI package. Protocol names equal xsAI factory names. Routes live on each model; capabilities split into model and route levels. Unknown values stay `undefined`. Data subpaths have no `@xsai/*` dependency. Amended to add `serviceTiers` to model capabilities.
- `Usage` gets disjoint token buckets and no cost field ([07](issues/07-usage-disjoint-buckets.md)). Text adapters get service tier selection ([08](issues/08-service-tier.md)). Both are xsAI core changes before 1.0.

## Not yet specified

- Cost type and semantics, including whether `Usage.inputTokens` includes cached tokens on each wire.
- Whether `route()` may fall back to a provider-level base URL, and how route `path` meets adapter paths.
- How local corrections and extra providers (Ollama, LiteLLM, and so on) are authored.
- Runtime fetch: source URL, cache, snapshot size, and refresh policy.
- AIRI acceptance for replacing `model-bank` and the 0.x imports.

## Out of scope

Provider lifecycle, credential storage, availability state, and provider-specific request rewrites (Azure, official AIRI endpoints).
