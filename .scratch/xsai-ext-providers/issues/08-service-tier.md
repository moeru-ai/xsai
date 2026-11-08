# Add service tier selection to text adapters

Parent: ../map.md
Type: task
Labels: needs-triage
Status: open
Blocked by: none

## Scope

Add `serviceTier` to `ChatProviderOptions` and the Responses provider options. Map it to the request `service_tier` field.
Check whether Anthropic Messages has an equivalent parameter, and add it only if the wire defines one.

## Open points

- The applied tier can differ from the requested tier (for example `auto`). The response reports the applied `service_tier`. Decide whether `step.end` exposes it. Until then, callers pass the requested tier to `cost()`.

## Acceptance

- Each supported wire sends the tier unchanged and omits the field when unset.
- Request tests cover set and unset tiers.
