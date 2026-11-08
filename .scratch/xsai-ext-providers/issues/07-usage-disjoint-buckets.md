# Make Usage token buckets disjoint

Parent: ../map.md
Type: task
Labels: needs-triage
Status: open
Blocked by: none

## Scope

Change `Usage` in `@xsai/text` so that each token field matches one price bucket:

```ts
interface Usage {
  cacheReadTokens?: number
  cacheWriteTokens?: number
  /** Uncached input only. Excludes `cacheReadTokens` and `cacheWriteTokens`. */
  inputTokens: number
  /** Includes `reasoningTokens`. */
  outputTokens: number
  /** Subset of `outputTokens`. */
  reasoningTokens?: number
  /** `inputTokens + cacheReadTokens + cacheWriteTokens + outputTokens`. */
  totalTokens: number
}
```

- Rename `cacheReadInputTokens` to `cacheReadTokens` and `cacheCreationInputTokens` to `cacheWriteTokens`.
- Chat and Responses subtract cache read and cache write tokens from the reported input. Clamp at zero. Keep the existing cache-read fallbacks (`prompt_cache_hit_tokens`).
- Messages keeps its input value and renames the cache fields.
- `Usage` carries no cost. Provider-billed cost (for example OpenRouter `usage.cost`) stays in raw events.
- No TTL split for cache writes.
- Update `collect` summing, docs, and tests.

Reference: pi `packages/ai/src/types.ts:467` and `src/api/openai-completions.ts:1527-1552`.

## Acceptance

- `inputTokens + cacheReadTokens + cacheWriteTokens + outputTokens === totalTokens` on all three wires when the wire reports cache fields.
- Old field names are removed from public types.
- Docs state that `inputTokens` differs from OpenAI `prompt_tokens` when cache is used.
