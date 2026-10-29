# Export Fetch and pass stable tool call IDs

Parent: ../map.md
Type: task
Labels: ready-for-agent
Status: resolved
Assignee: Codex
Blocked by: 04

## Scope

Implement batch 1 of the public-contract decision.
Export `Fetch = (request: Request) => Promise<Response>` from `@xsai/shared` and `xsai`.
Use `Fetch` for `HttpOptions.fetch`.
Add required `callId` to `ToolExecuteOptions` and pass the invocation's stable ID and signal to execution and tool hooks.
Direct execution can still omit the options object.

## Acceptance

- Public package exports expose the types.
- Parallel calls to the same tool retain distinct IDs when they finish in reverse order.
- Tool hooks and execution receive each call's ID and signal.
- Existing tool validation, hook identity checks, and cancellation tests pass.
- Type checks and lint pass for the affected code.

## Answer

Implemented on 2026-10-29.
`HttpOptions.fetch` uses the exported `Fetch` type, available through `@xsai/shared` and `xsai`.
`ToolExecuteOptions` requires `callId` when a context is supplied.
The loop supplies the invocation's ID and signal to both hooks and the executor.
Direct calls can omit the context.

The parallel-call test holds the first invocation until the second finishes.
It verifies distinct IDs, signals, hook contexts, and the resulting tool outputs.
Type assertions cover the public exports.
The tool API documentation now describes the context.

Validation passed:

- `pnpm exec vitest run packages/shared/test packages/text/test`: 11 files and 108 tests.
- `pnpm typecheck`.
- ESLint for the changed source, tests, and tool documentation.
- `git diff --check`.
