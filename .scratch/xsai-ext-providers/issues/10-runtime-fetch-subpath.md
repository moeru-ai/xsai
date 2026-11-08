# Add the runtime /fetch subpath

Parent: ../map.md
Type: task
Labels: needs-triage
Status: resolved
Blocked by: 03

## Scope

Implement `@xsai-ext/providers/fetch` as decided in issue 04, on top of `normalizeCatalog` from issue 03 (non-strict, `description: true`).
Default URL, `url` and `fetch` options, ETag revalidation through a caller-supplied `etag`, and the `{ notModified: true }` / `{ etag, providers }` result.
Decide whether runtime data applies `scripts/overrides.ts` corrections and `scripts/extra.ts` providers; today only codegen does.

## Acceptance

- A 304 response returns `{ notModified: true }` without parsing.
- Invalid models and routes are skipped; a non-object catalog or zero valid providers throws.
- `/fetch` bundles no provider data.

## Answer

Implemented on 2026-11-08 in `0e9c5996` on this branch.

- `/fetch` exports `fetchProviders({ etag, fetch, signal, url })` and `CATALOG_URL`. The result is `{ etag, notModified: false, providers }` or `{ notModified: true }`. `notModified: false` is added so callers can narrow on one field.
- `providers` is `Record<string, RuntimeProvider>`; `RuntimeProvider` and `RuntimeModel` (`Model` plus `description`) are public types. `RuntimeProvider` is assignable to `Provider`, so `createProvider` takes it.
- Runtime data applies the same corrections as codegen (decided with the user): overrides and extra providers moved from `scripts/` to `src/corrections/`, and `applyCorrections` serves both. Without `strict`, an override for a missing provider is skipped and models.dev wins over an extra provider with the same ID; codegen stays strict.
- Errors are plain `Error`, so `/fetch` has no `@xsai/*` dependency.

Validation:

- Live run against models.dev: 235 providers and 9144 models, equal to the generated modules; descriptions present; `google-vertex` has `apiKeyEnv: []`; revalidating with the returned weak ETag gave `{ notModified: true }`. Fetch and normalization took about 1.8 s.
- `/fetch` bundles to 2.8 KB gzipped with no provider modules (only the two extra providers).
- `pnpm sync` after the refactor produced no changes to generated modules.
- `vitest run`: 59 files, 475 tests. `pnpm typecheck`. ESLint clean.
