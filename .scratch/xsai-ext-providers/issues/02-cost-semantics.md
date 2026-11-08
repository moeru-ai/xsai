# Define cost semantics against xsAI Usage

Parent: ../map.md
Type: research
Labels: needs-triage
Status: open
Blocked by: 01

## Question

How does `cost(model, usage)` turn xsAI `Usage` into USD?
Check, per wire (Chat, Messages, Responses), whether `inputTokens` includes cached tokens and whether `outputTokens` includes reasoning tokens. Fix the rule in the `Usage` contract if adapters disagree.
Decide the handling of cache read, cache write TTLs, reasoning prices, context tiers, `multipliers` (time windows, holidays), and non-token units (audio, image).
