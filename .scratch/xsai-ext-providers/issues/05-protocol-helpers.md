# Add per-protocol helper subpaths

Parent: ../map.md
Type: task
Labels: needs-triage
Status: open
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
