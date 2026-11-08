# Add a path override to HttpOptions

Parent: ../map.md
Type: task
Labels: ready-for-agent
Status: resolved
Blocked by: none

## Scope

Add `path?: string` to `HttpOptions` in `@xsai/shared`. When set, it replaces the adapter's default request path (for example `chat/completions` or `systemone`). It resolves against `baseURL` like the default path.

- Resolve a leading `/` relative to `baseURL`, not to the origin. models.dev v2 writes paths as `/decisions` on `https://api.inceptionlabs.ai/v1` and means `https://api.inceptionlabs.ai/v1/decisions`. Today `requestURL` uses `new URL(path, base)`, which would drop `/v1`.
- Apply it in every adapter that sends one request path. Decide whether `models()` (`models` and `models/<id>`) accepts it or omits it from its options.

Motivation: models.dev v2 routes for Inception and Perplexity `systemone` use a non-default path (issue 05).

## Acceptance

- Each single-path adapter sends to the override when set and to its default otherwise.
- Tests cover a leading slash, no leading slash, and a `baseURL` with and without a trailing slash.

## Answer

Implemented on 2026-11-08 in `c6232ccc` on branch `feat/http-options-path`.

- `HttpOptions.path?: string` replaces the adapter's default path in `sendRequest`. Messages and Responses also use it for their replay source URL.
- Changed from the scope above: a leading `/` keeps the standard URL rule and resolves from the origin. `docs/shared.md` already documented that rule for `requestURL`, so changing it would silently break a public function. `@xsai-ext/providers` strips the leading `/` from v2 paths during normalization instead (issue 03).
- `models()` takes `Omit<HttpOptions, 'model' | 'path'>`. The type is the only guard; there is no runtime strip.

Validation:

- `vitest run` for shared, decide, model, text-chat, text-messages, and text-responses: 33 files, 213 tests.
- `pnpm typecheck`.
- ESLint on changed files: no errors; 6 existing TODO warnings.
