# Add the runtime /fetch subpath

Parent: ../map.md
Type: task
Labels: needs-triage
Status: claimed
Blocked by: 03

## Scope

Implement `@xsai-ext/providers/fetch` as decided in issue 04, on top of `normalizeCatalog` from issue 03 (non-strict, `description: true`).
Default URL, `url` and `fetch` options, ETag revalidation through a caller-supplied `etag`, and the `{ notModified: true }` / `{ etag, providers }` result.
Decide whether runtime data applies `scripts/overrides.ts` corrections and `scripts/extra.ts` providers; today only codegen does.

## Acceptance

- A 304 response returns `{ notModified: true }` without parsing.
- Invalid models and routes are skipped; a non-object catalog or zero valid providers throws.
- `/fetch` bundles no provider data.
