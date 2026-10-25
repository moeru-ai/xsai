# Which xsAI public contracts must change before 1.0?

Parent: ../map.md
Type: grilling
Labels: wayfinder:grilling
Status: resolved
Assignee: Codex
Blocked by: 01, 02, 03

## Question

Which public contracts must xsAI settle before AIRI migrates to 1.0?

## Answer

Approved on 2026-10-26.
A Part is one entry in message content.
A wire adapter maps shared contracts to one API protocol.

### Public changes

The changes affect `@xsai/text` and the three text wire adapters, except for `Fetch`:

| Contract | Decision |
| --- | --- |
| Audio input | Add `AudioPart`: `{ type: 'audio', data: string, format: 'wav' \| 'mp3' }`. Use raw base64 data. Allow it in user messages. Exclude URLs, `Blob`, and live streams. |
| File names | Add optional `FilePart.fileName`. Retain `data: string \| URL`. Chat maps the name to `file.filename`. Responses maps it to `input_file.filename`. Messages omits it without error. Do not map it to document `title`. |
| Native content | Allow `ProviderPart` in user messages and tool results. Retain its use in assistant messages. Use it for provider file references. Do not add `FilePart.fileId`. |
| Tool output | Use `TextPart \| ImagePart \| FilePart \| ProviderPart` for `ToolResultPartContent`. Exclude audio. Preserve each result's `callId`. |
| Tool context | Add `callId` to `ToolExecuteOptions` in `@xsai/text`. Supply each invocation's stable call ID. Retain `signal`. Exclude conversation `messages`. |
| Fetch type | Export `Fetch = (request: Request) => Promise<Response>` from `@xsai/shared`. Use it for `HttpOptions.fetch`. |

Expose the changes through existing package exports and `xsai`.
Map native content to its position in the target protocol.
If a wire cannot represent media, reject that media before the request.
An unsupported optional file name does not cause an error.

### Responsibilities

Retain the existing contracts and ownership:

- AIRI owns provider identity, credentials, history, and model and conversation scope. xsAI retains native Part source filtering without new scope errors.
- AIRI derives search and citation events from `includeRawEvents`. xsAI adds no observation callback.
- AIRI replaces the language model through `prepareStep` to change the protocol or transport. xsAI adds no transport override.
- AIRI owns authentication sessions, provider lifecycle, catalog policy, and provider request changes. xsAI passes a complete `Request` to custom fetch.
- xsAI retains request termination, truncation errors, cancellation, and tool-error behavior. A `step.end` ends one request. The aggregate `result` settles the tool loop.
- AIRI decides whether a turn succeeds. It waits for the aggregate result and event consumers before it saves a completed turn.
- AIRI retains live transcription, replacement text, Apple native lifecycle, and Sherpaw workers. Core xsAI retains file transcription. No new core live-transcription API blocks 1.0.

Preserve the current speech, transcription, embedding, and model-catalog contracts.

### Acceptance criteria

An implementation must pass these cases:

1. Import the new types through their package exports and `xsai`. Reject audio tool output at the type boundary.
2. Map both audio formats to Chat `input_audio` without changing bytes. Reject unsupported audio before fetch.
3. Preserve file names in Chat and Responses, including supported file tool output. Cover absent names, spaces, and Unicode.
4. Send the same Messages document with or without `fileName`. Add neither `filename` nor `title`.
5. Preserve text, image, and file tool output where the wire supports them. Reject unsupported combinations before the next request.
6. Preserve native fields and placement in user input, tool results, and assistant replay. Retain source filtering without new mismatch errors.
7. Prevent native history from crossing AIRI provider, endpoint, model, or conversation scope.
8. Run parallel calls to the same tool with distinct IDs and reversed completion order. Preserve each ID and signal through execution.
9. Preserve complete requests, model replacement, and raw search and citation events.
10. Cover incomplete, failed, cancelled, and truncated requests, tool failures, and unresolved calls at the loop limit. Prevent premature turn completion.

### Evidence

The [text](../research/text-contract.md), [provider](../research/provider-boundary.md), and [audio](../research/audio-and-consumers.md) notes record the migration baseline.
AIRI's [Spark Notify tools](../../../../airi/packages/core-agent/src/agents/spark-notify/tools.ts) use call IDs in production.
The tool audit found cancellation users but no production executor that reads `messages`.

[OpenAI file inputs](https://developers.openai.com/api/docs/guides/file-inputs) support file names in Chat and Responses.
The local Responses type already contains `filename`, but its mapper omits it.
Anthropic's [DocumentBlockParam](https://github.com/anthropics/anthropic-sdk-typescript/blob/main/src/resources/messages/messages.ts) has `title`, not `filename`.
