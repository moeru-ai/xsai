# Count cache tokens in Messages inputTokens

Parent: ../map.md
Type: task
Labels: needs-triage
Status: resolved
Blocked by: none

## Scope

Make `Usage.inputTokens` mean the same on all text wires: all input tokens, including cache reads and cache writes. This is the Chat and Responses meaning today.

- Messages adds `cache_read_input_tokens` and `cache_creation_input_tokens` to `inputTokens`. See `packages/text-messages/src/utils/messages-event-stream.ts:38-58`.
- `cacheReadInputTokens` and `cacheCreationInputTokens` keep their names and become documented subsets of `inputTokens`.
- `totalTokens` stays `inputTokens + outputTokens`.
- Document that `reasoningTokens` is a subset of `outputTokens`.

This is a breaking change for Messages callers that read `inputTokens`.

## Acceptance

- `inputTokens + outputTokens === totalTokens` on all three wires.
- Messages tests cover cache read and cache creation counts.
- Docs state the subset rules.

## Answer

Implemented on 2026-11-08 in `7b88c299` on branch `fix/messages-usage-input`.

- Messages adds `cache_read_input_tokens` and `cache_creation_input_tokens` to `inputTokens`. `totalTokens` is `inputTokens + outputTokens`.
- `Usage` field comments state the subset rules. `docs/text/api.md` states them too.

Validation:

- `vitest run` for text, text-chat, text-messages, and text-responses: 31 files, 248 tests.
- `pnpm typecheck`.
- ESLint on changed files: no errors; 1 existing TODO warning.
