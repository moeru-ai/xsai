# What text, message, and tool contracts block AIRI migration?

Parent: ../map.md
Type: research
Labels: wayfinder:research, ready-for-agent
Status: resolved
Assignee: text_research
Blocked by: none

## Question

Compare xsAI beta.3 with AIRI chat, message persistence, tool execution, Responses patch, cancellation, and streaming. Identify existing support, confirmed gaps, and proposed breaking changes. Cite local primary sources.

## Answer

Findings: [Text contract research](../research/text-contract.md)

The main contract gaps are media and provider configuration. AIRI has audio input, provider file references, and file tool output that xsAI beta.3 cannot represent in its shared Parts. AIRI also consumes Responses native events for search and citations, which v1 already exposes as raw events through one stream reader. The report records the per-step provider configuration boundary, old versus v1 tool execution context, cancellation and incomplete status differences, and the distinction between AIRI's scoped `ProviderContinuation` and xsAI `providerMetadata`.

The proposed xsAI work adds media contracts and documents existing per-step model replacement. A new native event hook is optional. Production tool use determines whether execution needs `callId`. AIRI can prepare cleanly inside its existing `core-agent/runtime/chat-completions.ts`, `responses.ts`, and `xsai-events.ts` boundary. Preparation keeps the current continuation and history model. The later cutover maps `abortSignal` to `signal` and awaits the aggregate v1 result. UI and configuration stay unchanged.
