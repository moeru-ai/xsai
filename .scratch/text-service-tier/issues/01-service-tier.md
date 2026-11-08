# Add service tier selection to text adapters

Parent: none
Type: task
Labels: needs-triage
Status: resolved
Blocked by: none

## Scope

Add `serviceTier` to `ChatProviderOptions` and the Responses provider options. Map it to the request `service_tier` field.
Check whether Anthropic Messages has an equivalent parameter, and add it only if the wire defines one.

## Open points

- The applied tier can differ from the requested tier (for example `auto`). The response reports the applied `service_tier`. Decide whether `step.end` exposes it.

## Acceptance

- Each supported wire sends the tier unchanged and omits the field when unset.
- Request tests cover set and unset tiers.

## Answer

Implemented on 2026-11-08 in `49e9bdb1` on branch `feat/text-service-tier` (from `main`), PR #349.

- All three wires define `service_tier` as a string: Chat Completions, Responses, and Anthropic Messages (`auto`, `standard_only`). So `serviceTier` is a shared field on `LanguageModelOptions`, not a provider option.
- The type lists common values and accepts any string: `'auto' | 'default' | 'flex' | 'priority' | 'standard_only' | (string & {})`. Compatible endpoints add their own values, for example Groq `on_demand`/`performance`, Bedrock `reserved`, and xAI `fast`.
- Each adapter sends the value unchanged and omits `service_tier` when unset.
- `toDecisionModel` passes `serviceTier` through with the other model options.
- `step.end` does not expose the applied tier. Decided to leave it out for now.

Validation:

- `vitest run` for text, text-chat, text-messages, text-responses, and decide: all pass.
- `pnpm typecheck`.
- ESLint on changed files: no errors; existing TODO warnings only.
