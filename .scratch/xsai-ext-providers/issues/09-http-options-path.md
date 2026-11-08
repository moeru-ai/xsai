# Add a path override to HttpOptions

Parent: ../map.md
Type: task
Labels: needs-triage
Status: open
Blocked by: none

## Scope

Add `path?: string` to `HttpOptions` in `@xsai/shared`. When set, it replaces the adapter's default request path (for example `chat/completions` or `systemone`). It resolves against `baseURL` like the default path.

- Resolve a leading `/` relative to `baseURL`, not to the origin. models.dev v2 writes paths as `/decisions` on `https://api.inceptionlabs.ai/v1` and means `https://api.inceptionlabs.ai/v1/decisions`. Today `requestURL` uses `new URL(path, base)`, which would drop `/v1`.
- Apply it in every adapter that sends one request path. Decide whether `models()` (`models` and `models/<id>`) accepts it or omits it from its options.

Motivation: models.dev v2 routes for Inception and Perplexity `systemone` use a non-default path (issue 05).

## Acceptance

- Each single-path adapter sends to the override when set and to its default otherwise.
- Tests cover a leading slash, no leading slash, and a `baseURL` with and without a trailing slash.
