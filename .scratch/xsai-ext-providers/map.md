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
- Both delivery modes: build-time generated data and a runtime `/fetch`.
- The root entry exports types and `route()` only. It never exports all provider data. All providers live at `/full`.
- Each provider is a subpath (`@xsai-ext/providers/deepseek`) through one `"./*"` export pattern. Exact keys (`./capabilities`, `./fetch`, `./full`, helper subpaths) take precedence. Codegen fails when a provider ID matches a reserved subpath.
- `route()` is pure data and returns `HttpOptions`-compatible fields plus the protocol.
- Helpers take a provider data object, not an ID string. A model without a route for that protocol throws before fetch. Subpath layout superseded by [Add per-protocol helper subpaths](issues/05-protocol-helpers.md).
- Peer ranges pin the current xsAI beta until 1.0, then widen to `^1.0.0`.
- [Define the normalized types](issues/01-normalized-types.md): Include model types with an xsAI package. Protocol names equal xsAI factory names. Routes live on each model; capabilities split into model and route levels. Unknown values stay `undefined`. Data subpaths have no `@xsai/*` dependency. Amended to add `serviceTiers` to model capabilities.
- [Define cost semantics](issues/02-cost-semantics.md): Price data only. `Model.cost` holds text token prices per million tokens. No `cost()` function and no `/costs` subpath.
- Messages `Usage.inputTokens` will include cache tokens to match Chat and Responses ([07](issues/07-messages-usage-input.md)). Service tier selection moved to `LanguageModelOptions.serviceTier` ([text-service-tier](../text-service-tier/issues/01-service-tier.md), PR #349).
- [Define AIRI acceptance](issues/06-airi-acceptance.md): Existing fields cover AIRI's model-bank reads. `description` comes only from `/fetch`. Hosted search support, provider ID mapping, and reasoning `mandatory` stay in AIRI. 0.x imports move to xsAI 1.0 factories in the AIRI migration.
- [Define runtime fetch](issues/04-runtime-fetch.md): Fetch models.dev v2 with ETag revalidation. No bundled snapshot and no persistent cache; the caller owns fallback and storage. Runtime decoding skips invalid entries; codegen is strict.
- [Generate per-provider modules and the export map](issues/03-codegen-and-exports.md): `packages-ext/providers` with a shared models.dev normalizer and `pnpm sync`. Modules export `<name>: Provider<'ids'>`; `/full` exports `providers`. Codegen fails on reserved, invalid, or clashing IDs.
- Providers get computed `defaults` per protocol, so `route()` works for model IDs missing from the catalog. Corrections live in `scripts/overrides.ts`, extra providers (`ollama`, `litellm`) in `scripts/extra.ts`. Route `path` reaches adapters through a new `HttpOptions.path` ([09](issues/09-http-options-path.md)).
- [Add per-protocol helper subpaths](issues/05-protocol-helpers.md): Reworked twice after usability reviews. `/create` exports `createProvider(provider, { apiKey })`, whose `text`, `embedding`, `image`, `speech`, `transcription`, and `decision` methods pick the protocol themselves (text: `responses`, `messages`, `chat`). Unset keys come from `process.env` via `Provider.apiKeyEnv`. Root exports `route()` and `accepts()`.
- [Add the runtime /fetch subpath](issues/10-runtime-fetch-subpath.md): `fetchProviders()` with ETag revalidation returns the generated data plus descriptions. Runtime applies the same overrides and extra providers, now in `src/corrections/`.

## Not yet specified

None.

## Out of scope

Provider lifecycle, credential storage, availability state, and provider-specific request rewrites (Azure, official AIRI endpoints).
