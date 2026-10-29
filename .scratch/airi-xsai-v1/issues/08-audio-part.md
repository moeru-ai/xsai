# Add audio input Parts

Parent: ../map.md
Type: task
Labels: ready-for-agent
Status: resolved
Assignee: Codex
Blocked by: 04

## Scope

Implement the `AudioPart` decision from issue 04.
Allow `{ type: 'audio', data: string, format: 'wav' | 'mp3' }` in user messages.
`data` contains raw base64 audio.
Chat maps the Part to `input_audio` without changing the data.
Messages and Responses reject audio with `invalid-input` before fetch.
Audio remains excluded from assistant messages and tool output.

## Acceptance

- Export `AudioPart` through `@xsai/text` and `xsai`.
- Preserve both formats and mixed user content in Chat requests.
- Reject audio on unsupported wires before fetch.
- Check the type boundaries for roles, tool output, data, and formats.
- Pass affected tests, type checks, and lint.

## Answer

Implemented on 2026-10-29.
`AudioPart` is exported through `@xsai/text` and `xsai` and allowed in user messages.
Chat maps raw base64 and its format to `input_audio`.
Messages and Responses reject audio with `invalid-input` before calling fetch.
The API reference and message guide describe audio input.

Request tests cover both formats, unchanged data, and content order.
Unsupported-wire tests verify that fetch is never called.
Type checks cover exports, supported formats, string data, and exclusion from other roles and tool output.

Validation passed:

- `pnpm exec vitest run packages/text/test packages/text-chat/test packages/text-messages/test packages/text-responses/test`: 31 files and 236 tests.
- `pnpm typecheck`.
- ESLint for the changed source, tests, and documentation, with two existing TODO warnings and no errors.
- `git diff --check`.
