# Define cost semantics against xsAI Usage

Parent: ../map.md
Type: research
Labels: needs-triage
Status: claimed
Blocked by: 01

## Question

How does `cost(model, usage)` turn xsAI `Usage` into USD?
Check, per wire (Chat, Messages, Responses), whether `inputTokens` includes cached tokens and whether `outputTokens` includes reasoning tokens. Fix the rule in the `Usage` contract if adapters disagree.
Decide the handling of cache read, cache write TTLs, reasoning prices, context tiers, `multipliers` (time windows, holidays), and non-token units (audio, image).

## Comments

2026-11-08:

- Usage semantics follow issue 07: disjoint token buckets, no cost in `Usage`, no cache write TTL split.
- `cost(model, usage, options?)` lives in `@xsai-ext/providers`. It estimates from catalog prices only. Provider-billed cost is not handled.
- Cache writes use the first listed TTL price by default. `options.cacheTTL` selects another TTL.
- `Cost` keeps service tier multipliers and overrides. `options.serviceTier` selects them; the base price applies when unset. Tier selection in requests is issue 08.
- Open: tiers, reasoning prices, other conditions, non-token units, web search, and the return shape.
