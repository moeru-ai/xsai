# Define cost semantics against xsAI Usage

Parent: ../map.md
Type: grilling
Labels: wayfinder:grilling
Status: resolved
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

## Answer

Resolved on 2026-11-08. The package exposes price data only. It has no `cost()` function and no `/costs` subpath.

```ts
/** USD per million text tokens. */
interface Cost {
  cacheRead?: number
  /** The first listed TTL price when models.dev lists several. */
  cacheWrite?: number
  input?: number
  output?: number
}
```

- `Model.cost` holds text token prices only.
- Not kept: context tiers, service tier multipliers and overrides, reasoning prices, other conditions (region, time, resolution), non-token units (characters, seconds, images), and web search prices. Add them as fields when a consumer needs them.
- AIRI uses model pricing for display, which this data covers.
- Superseded by this answer: the `cost()`, `cacheTTL`, and `serviceTier` notes in the comments above.
- Issue 07 is reduced to a minimal Usage fix. Service tier selection moved to `../../text-service-tier/`.

### Amendment (2026-11-08): cache prices

From the PR #350 review, implemented in `d5bff7d0`. Supersedes "the first listed TTL price".

```ts
interface CachePrices {
  cacheRead?: number
  cacheWrite?: number | Record<string, number> // per TTL, such as { '5m': 3.75, '1h': 6 }
}
interface Cost extends CachePrices {
  explicit?: CachePrices // when explicit caching is priced differently
  input?: number
  output?: number
}
```

Mirrors models.dev `cost.text.input.cache`. `storage` (47 models) is still dropped.
